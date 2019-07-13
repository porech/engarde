import { Component, OnInit, Input, HostListener, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { DataSourceModel } from '../models/mydatatable/datasource.model';
import { DataRowsModel } from '../models/mydatatable/datarow.model';
import tableDragger from 'table-dragger'
import { Observable } from 'rxjs';
declare var jsPDF: any; 

@Component({
  selector: 'my-datatable',
  templateUrl: './mydatatable.component.html',
  styleUrls: ['./mydatatable.component.css']
})

export class MydatatableComponent implements OnInit, AfterViewInit {
  @Input() dataSource : DataSourceModel;
  public customElements = '';
  @Input() config : {};
  cardStyles = {};
  public customElementsLoaded: boolean = false;
  public tableId: string = "";
  isMobileView = true;
  public dragOptions : {
    isDraggable: boolean,
    dragMode: "row"|"column"|"free",
    backgroundColor: string,
    textColor: string
  } = {
     isDraggable: false,
     dragMode: "row",
     backgroundColor: "white",
     textColor: "black"
  };


  constructor() { 
      
  }

  @ViewChild('customElements') customElem: ElementRef;
  @ViewChild('customElementsMobile') customElemMob: ElementRef;

  ngAfterViewInit() {    
    if (this.dataSource && this.dataSource.content) {

      this.dataSource.content.rows.forEach(row => {
        row.cells.forEach(cell => {
            if (cell.options && cell.options.customElements) {
                this.customElements = this.getCustomElements(cell);
            }
        })
      })
    }
    this.checkCustomElementsOnResize();
    var el = document.getElementById('mydatatable');

    this.checkDragMode();
    if (this.dragOptions.isDraggable) {
          document.querySelector("table").style.cssText = "--background-default: " + this.dragOptions.backgroundColor+"; --text-default: " + this.dragOptions.textColor;
      var myRows = this.dataSource.content.rows;
        var dragger = tableDragger(el, {
          mode: 'row',
          dragHandler: '.handle',
          onlyBody: true,
          animation: 300
        });
        dragger.on('drag', function () {

        });
      var swapArrayElements = function (arr, indexA, indexB) {
        var temp = arr[indexA];
        arr[indexA] = arr[indexB];
        arr[indexB] = temp;
      };
        dragger.on('drop', function (from, to) {
          console.log(from);
          console.log(to);
          if (from <= myRows.length && to <= myRows.length && from != to) {
            console.log("1. MyRows [pre-edit]: " + JSON.stringify(myRows));
          swapArrayElements(myRows, from - 1, to - 1);
          var event = new CustomEvent("newrows", {
            detail: {
              rows: myRows
            }
          });
          window.dispatchEvent(event);
        }
      
    
    })
  
  }
}

  ngOnInit() {
    let event = {
      target: {
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight
      }
    }
      this.checkMobileView(event); 

      this.getCardStyles();
   
  }

  @HostListener('window:newrows', ['$event'])
  editRows(event) {
    this.dataSource.content = event.detail;
    console.log("2. DataSource content (post-edit): "+JSON.stringify(this.dataSource.content))
  }
  exportPdf(columns, rows, filename) {
    var pdf = new jsPDF('p', 'pt');
    //pdf.autoTable(this.dataSource.content.rows, this.dataSource.header.cells);
    //let columns = [{ title: "id", dataKey: "id" }, { title: "nome", dataKey: "nome" }]
    //let rows = [{ "id": 1, "nome": "tizio" }, { "id": 2, "nome": "caio" }]
    let defaultFillColorAlternateRow = [74, 96, 117];
    let defaultFillColorBodyStyles = [52, 73, 94];
    let defaultTextColor = 240;
    pdf.autoTable(columns, rows, {

      alternateRowStyles: {
        fillColor: (this.config['tableBackground'].doubleColor.enabled ? this.config['tableBackground'].doubleColor.primaryColor : defaultFillColorAlternateRow )
      },
      bodyStyles: {
        fillColor: (this.config['tableBackground'].doubleColor.enabled ? this.config['tableBackground'].doubleColor.secondaryColor : defaultFillColorBodyStyles ),
        textColor: (this.config['textColor'] ? this.config['textColor'] : defaultTextColor ),
      },
    });
    pdf.save(filename+'.pdf');
  }
  findCellIndex(array, position) {
      let iterator=0;
      let found;
      array.forEach(item => {
        if (item && item.position && item.position == position) {
          found=iterator;
          return;
        }
        iterator+=1;
      });
      return found;
  }
  checkCustomElementsOnResize() {
    if (!this.customElementsLoaded) {
      if (this.customElem) {
        this.customElem.nativeElement.insertAdjacentHTML('beforeend', this.customElements);
        this.customElementsLoaded = true;
      } 
    }
  }
  checkDragMode() {
    this.dragOptions.isDraggable = (this.config && this.config['dragdrop']['isDraggable']);
    this.dragOptions.dragMode = (this.config && this.config['dragdrop']['dragMode']) ? this.config['dragdrop']['dragMode'] : this.dragOptions.dragMode;
    this.dragOptions.backgroundColor = (this.config && this.config['dragdrop']['backgroundColor']) ? this.config['dragdrop']['backgroundColor'] : this.dragOptions.backgroundColor;
    this.dragOptions.textColor = (this.config && this.config['dragdrop']['textColor']) ? this.config['dragdrop']['textColor'] : this.dragOptions.textColor;
  }
  getCardStyles() {
    if (this.config) {
      this.cardStyles['width'] = (this.config['tableWidth']) ? this.config['tableWidth'] : "";
      this.cardStyles['height'] = (this.config['tableHeight']) ? this.config['tableHeight'] : "";
      this.cardStyles['background-color'] = (this.config['tableBackgroundColor']) ? this.config['tableBackgroundColor'] : "";
      if (!this.config['tableBackgroundColor']) {
        this.cardStyles['background-color'] = this.config['tableBackground'].color ? this.config['tableBackground'].color : ''; 
      }
      this.cardStyles['padding'] = this.config['tablePadding'] ? this.config['tablePadding'] : 0;
      this.tableId = this.config['tableId'] ? this.config['tableId'] : '';
    }

  }
  getCustomElements(cell) {
    let customElements = "";
    cell.options.customElements.forEach(element => {
      customElements += '<' + element.name + ' ' + element.bindings.key + (element.bindings.value ? '="' + element.bindings.value+'"' : '') + ' style="'+element.style+'">'+element.content+'</'+element.name+'>'
    });
    return customElements;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.checkMobileView(event);
    this.checkCustomElementsOnResize();
    
  }

  checkMobileView(event) {
    let width = event.target.innerWidth;
    let isMobileDevice = false;
    if (navigator.userAgent.includes("Android") || navigator.userAgent.includes("iPhone") || navigator.userAgent.includes("iPad")) {
      isMobileDevice = true;
    }
    if (width < 600 || isMobileDevice) {
      this.isMobileView = true;
    } else {
      this.isMobileView = false;
    }

    if (this.isMobileView) {
        this.customElementsLoaded = false;
    }
  }

}
