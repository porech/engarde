import { Component } from "@angular/core";
import { APICallerService } from "./services/apicaller.service";
import { IfaceModel } from "./models/iface.model";
import { SocketModel } from "./models/socket.model";
import { getScaleInAnimation } from "./animations/scalein.animation";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { getSlideOutAnimation } from "./animations/slideout.animation";
import { DialogComponent } from "./components/dialog/dialog.component";
import { RespModel } from "./models/resp.model";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  animations: [getScaleInAnimation(), getSlideOutAnimation()]
})
export class AppComponent {
  public type: string;
  public version: string;
  public listenAddress: string;
  public description: string;
  public ifaces: IfaceModel[];
  public sockets: SocketModel[];
  public errorMessage;
  public loaded: boolean = false;
  public hintAnimationActive: boolean = false;
  public hintAnimationIdle: boolean = false;
  public hintAnimationExcluded: boolean = false;
  private getListErrors: number = 0;
  private listTimeout: number = null;

  constructor(public api: APICallerService, public dialog: MatDialog) {}

  getList() {
    this.listTimeout = null;
    let startTime = new Date().getTime();
    this.api.getList().subscribe(
      (resp: RespModel) => {
        this.loaded = true;
        this.type = resp.type;
        this.version = resp.version;
        this.description = resp.description;
        this.listenAddress = resp.listenAddress;
        if (this.type == "client") {
          this.ifaces = resp.interfaces;
        } else {
          this.sockets = resp.sockets;
        }
        this.getListErrors = 0;
        this.errorMessage = null;
        let callDuration = new Date().getTime() - startTime;
        if (this.listTimeout) {
          clearTimeout(this.listTimeout);
        }
        this.listTimeout = window.setTimeout(() => {
          this.getList();
        }, Math.max(1000 - callDuration, 0));
      },
      err => {
        this.getListErrors += 1;
        if (this.getListErrors >= 2) {
          this.type = null;
          this.loaded = true;
          this.errorMessage = err.statusText || err.message;
          if (this.listTimeout) {
            clearTimeout(this.listTimeout);
          }
          this.listTimeout = window.setTimeout(() => {
            this.getList();
          }, 1000);
        } else {
          let callDuration = new Date().getTime() - startTime;
          if (this.listTimeout) {
            clearTimeout(this.listTimeout);
          }
          this.listTimeout = window.setTimeout(() => {
            this.getList();
          }, Math.max(1000 - callDuration, 0));
        }
      }
    );
  }

  filterActive(iface: IfaceModel) {
    return iface.status == "active";
  }

  filterIdle(iface: IfaceModel) {
    return iface.status == "idle";
  }

  filterExcluded(iface: IfaceModel) {
    return iface.status == "excluded";
  }

  trackByName(index, iface) {
    return iface.name;
  }

  trackByAddress(index, iface) {
    return iface.address;
  }

  toggleExclude(ifname: string) {
    let activeIfaces = this.ifaces.filter(i => i.status == "active");
    if (activeIfaces.length == 1 && activeIfaces[0].name === ifname) {
      this.dialog.open(DialogComponent, {
        data: {
          title: "OCIO! WARNING!",
          content: `Ehi, wait a second. You're going to exclude the only active interface.
          This way, the tunnel will go down FOR SURE! Do you <b>REALLY</b> want to proceed?`,
          thingsToBeDone: [
            {
              label: "NO - Please save me and let engarde live.",
              whatToDo: () => {
                this.dialog.closeAll();
              }
            },
            {
              label: "YES - I want engarde to drop!",
              whatToDo: () => {
                this.dialog.closeAll();
                this.api.toggleOverride(ifname);
              }
            }
          ]
        }
      });
    } else {
      this.api.toggleOverride(ifname);
    }
  }

  resetExcludes() {
    this.api.clearOverrides();
  }

  ngOnInit() {
    this.getList();
  }
}
