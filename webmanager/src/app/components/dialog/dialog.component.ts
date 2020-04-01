import {
  Component,
  Inject,
  ComponentFactoryResolver,
  ViewChild,
  ViewContainerRef,
  AfterViewInit,
  AfterContentInit,
  Output,
  EventEmitter
} from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
// occhio a non rimuovere questa riga, sembra inutilizzato ma è utilizzato nell'html
import { Nl2BrPipeModule } from "nl2br-pipe";
import { StringToObjectFilterPipe } from "../../pipes/string2objectfilter.pipe";
import { APICallerService } from "src/app/services/apicaller.service";
@Component({
  selector: "custom-dialog",
  templateUrl: "./dialog.component.html",
  styleUrls: ["./dialog.component.scss"]
})
export class DialogComponent implements AfterContentInit {
  title: string;
  content: string;
  componentData: {};
  userInput: {
    enabled: boolean;
    values: [
      {
        name: string;
        value: string;
        placeholder: string;
        type: string;
        autocompletion?: {
          enabled: boolean;
          autocompleteModel: any;
          filterModelBy: string;
        };
      }
    ];
  } = {
    enabled: false,
    values: [
      {
        name: "",
        value: null,
        placeholder: null,
        type: "text"
      }
    ]
  };
  thingsToBeDone: [
    {
      label: string;
      whatToDo: (res?) => void;
    }
  ];
  canShowAutoComplete = false;
  @ViewChild("vc", { read: ViewContainerRef, static: true })
  contentComp: ViewContainerRef;
  componentContentData;
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private componentFactoryResolver: ComponentFactoryResolver,
    public apiCaller: APICallerService
  ) {
    dialogRef.disableClose = false;
    this.thingsToBeDone = data.thingsToBeDone;
    this.title = data.title;
    if (typeof data.content === "string") {
      this.content = data.content;
      //console.log("DataContent: " + data.content);
    } else {
      this.componentContentData = data.content;
    }
    if (data.componentData) {
      this.componentData = data.componentData;
    }
    if (data.userInput) {
      this.userInput = data.userInput;
    }
  }
  checkAutoComplete(val) {
    setTimeout(() => {
      if (val && val != "") {
        this.canShowAutoComplete = true;
      } else {
        this.canShowAutoComplete = false;
      }
    }, 100);
  }
  ngAfterContentInit() {
    if (typeof this.content !== "string" && this.content !== undefined) {
      let componentFactory = this.componentFactoryResolver.resolveComponentFactory(
        this.componentContentData
      );
      //console.log(this.contentComp);

      let componentRef = this.contentComp.createComponent(componentFactory);
      componentRef.instance["data"] = this.componentData;
    }
  }
  doStuff(whatToDo: (res?) => void, res?) {
    if (res && whatToDo) {
      whatToDo(res);
    } else {
      if (whatToDo) {
        whatToDo();
      }
    }
    this.dialogRef.close();
  }
}

export const DialogConfig = {
  CLOSE_ACTION: { label: "CHIUDI", whatToDo: () => {} }
};
