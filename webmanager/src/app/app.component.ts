import { Component } from '@angular/core';
import { APICallerService } from './services/apicaller.service';
import { RespModel } from './models/resp.model';
import { IfaceModel } from './models/iface.model';
import { SocketModel } from './models/socket.model';
import { getScaleInAnimation } from './animations/scalein.animation';
import { DataSourceModel } from './components/mydatatable/models/mydatatable/datasource.model';
import { DataTableConfig } from './components/mydatatable/models/mydatatable/datatableconfig.model';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { getSlideOutAnimation } from './animations/slideout.animation';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [getScaleInAnimation(), getSlideOutAnimation()]
})
export class AppComponent {

  public type: string
  public version: string
  public listenAddress: string
  public description: string
  public ifaces: IfaceModel[]
  public sockets: SocketModel[]
  public errorMessage;
  public loaded : boolean = false;
  public snackBarConfig;
  public hintAnimationActive : boolean = false;
  public hintAnimationIdle : boolean = false;
  public hintAnimationExcluded : boolean = false;
  private getListErrors: number = 0;
  dataconfig: DataTableConfig = {
    mobileHeaderColor: "#FFC107"
  }


  constructor(public api: APICallerService, public snackBar: MatSnackBar) {
    this.snackBarConfig = new MatSnackBarConfig();
    this.snackBarConfig.panelClass = ['snackbar']  
    this.snackBarConfig.duration = 1000;
  }
  
  getList() {
    this.api.getList().then(resp => {
      this.loaded = true;
      this.type = resp.type
      this.version = resp.version
      this.description = resp.description
      this.listenAddress = resp.listenAddress
      if(this.type == 'client') {
        this.ifaces = resp.interfaces
      } else {
        this.sockets = resp.sockets
      }
      this.getListErrors = 0;
      this.errorMessage = null;
      window.setTimeout(() => { this.getList() }, 800)
    })
    .catch(err => {
      this.getListErrors += 1;
      if(this.getListErrors > 2) {
        this.type = null;
        this.loaded = true;
        this.errorMessage = err.status == 0 || err.status == 404 ? "Check engarde service" : err.statusText;
        this.snackBar.open(`ERR: ${err.statusText}`, null, this.snackBarConfig);
        window.setTimeout(() => { this.getList() }, 10000);
      } else {
        window.setTimeout(() => { this.getList() }, 800)
      }
    })
  }

  filterActive(iface: IfaceModel) {
    return iface.status == 'active'
  }

  filterIdle(iface: IfaceModel) {
    return iface.status == 'idle'
  }

  filterExcluded(iface: IfaceModel) {
    return iface.status == 'excluded'
  }

  toggleExclude(ifname: string) {
    this.api.toggleOverride(ifname)
  }

  resetExcludes() {
    this.api.clearOverrides()
  }
  
  ngOnInit() {
    this.getList();
  }
}
