import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { ActionbarService } from 'src/app/services/actionbar.service';

@Component({
  selector: 'app-actionbar',
  templateUrl: './actionbar.component.html',
  styleUrls: ['./actionbar.component.css']
})
export class ActionbarComponent implements OnInit {
  @Input() title : string = "";
  @Input() color : string;
  @Input() textColor: string;
  @Input() logo: string;
  public mButtons = [];
  @ViewChild("titlecontainer") backgroundRef : ElementRef;
  constructor(public actionBarService : ActionbarService ) { 
  }

  ngOnInit() {
    this.color ? this.actionBarService.setBackgroundColor(this.color) : '';
    this.textColor ? this.actionBarService.setTextColor(this.textColor) : '';
    this.manageButtons();
    this.manageColors();
  }
  manageButtons() {
    this.actionBarService._actionbarButtonListObservable.subscribe(newValue => {
      this.mButtons = newValue;
    })
  }
  manageColors() {
    this.backgroundRef.nativeElement.style.backgroundColor = this.color;
    this.backgroundRef.nativeElement.style.color = this.textColor;

    this.actionBarService._actionbarBackgroundObservable.subscribe(newValue => {
      this.color = newValue;
      this.backgroundRef.nativeElement.style.backgroundColor = this.color;
    })
    this.actionBarService._actionbarTextColorObservable.subscribe(newValue => {
      this.textColor = newValue;
      this.backgroundRef.nativeElement.style.color = this.textColor;
    })
  }

  

}
