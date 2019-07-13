import { Component } from '@angular/core';
import { APICallerService } from './services/apicaller.service';
import { RespModel } from './models/resp.model';
import { IfaceModel } from './models/iface.model';
import { SocketModel } from './models/socket.model';
import { getScaleInAnimation } from './animations/scalein.animation';
import { DataSourceModel } from './components/mydatatable/models/mydatatable/datasource.model';
import { DataTableConfig } from './components/mydatatable/models/mydatatable/datatableconfig.model';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [getScaleInAnimation()]
})
export class AppComponent {

  public type: string
  public version: string
  public listenAddress: string
  public ifaces: IfaceModel[]
  public sockets: SocketModel[]
  public errorMessage = "";
  dataconfig: DataTableConfig = {
    mobileHeaderColor: "#FFC107"
  }


  constructor(public api: APICallerService, public snackBar: MatSnackBar) {}
  
  getList() {
    this.api.getList().then(resp => {
      this.type = resp.type
      this.version = resp.version
      this.listenAddress = resp.listenAddress
      if(this.type == 'client') {
        this.ifaces = resp.interfaces
      } else {
        this.sockets = resp.sockets
      }
    })
    .catch(err => {
        this.errorMessage = err.status == 0 || err.status == 404 ? "Check engarde service" : err.statusText;
        let conf = new MatSnackBarConfig();
        conf.panelClass = ['snackbar']  
        conf.duration = 1000;
        this.snackBar.open(`ERR: ${err.statusText}`, null, conf);
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
    this.getList()
    this.startPolling();
    
  }

  startPolling() {
    let interval = window.setInterval(()=>{
      this.getList();
      if (this.errorMessage !== "") {
        window.clearInterval(interval);
      }
    
    }, 1000)
  }
}
