import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { RespModel } from '../models/resp.model';

/**
@Injectable({
  providedIn: 'root'
})
 */
@Injectable()
export class APICallerService {
  /**
   * 
   * @param http il servizio HTTP iniettato
   */

  // For development purposes you can set an API prefix here.
  // ONLY COMMIT WITH THIS VARIABLE EMPTY!!!
  private apiPrefix = "http://127.0.0.1:42490"

  constructor(public http : HttpClient) { }

  public getList() {
    return this.http.get(this.apiPrefix + "/api/v1/get-list")
    .toPromise()
    .then(res => {
      return res as RespModel
    })
  }

  public toggleOverride(iface: string) {
    return this.http.post(this.apiPrefix + "/api/v1/swap-exclusion", {"interface" : iface})
    .toPromise()
    .then(res => {
      return res['status'];
    })
  }

  public clearOverrides() {
    return this.http.get(this.apiPrefix + "/api/v1/reset-exclusions")
    .toPromise()
    .then(res => {
      return res['status'];
    })
  }
}
