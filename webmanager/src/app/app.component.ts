import { Component } from '@angular/core';
import { APICallerService } from './services/apicaller.service';
import { RespModel } from './models/resp.model';
import { IfaceModel } from './models/iface.model';
import { SocketModel } from './models/socket.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public type: string
  public version: string
  public listenAddress: string
  public ifaces: IfaceModel[]
  public sockets: SocketModel[]

  constructor(public api: APICallerService) {}
  
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
    window.setInterval(()=>{this.getList()}, 1000)
  }
}
