import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SelectMenuApi } from '@service/imqm-sdk';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ImqmSelectService {

  constructor(private _http: HttpClient, private selectService: SelectMenuApi) { }

  // 獲取site 下拉框資料
  getSelectDatas(data?) {
    return this.selectService.getSelectMenu(data).pipe(map((res) => {
      console.log(res['result']);
      return res['result'];
    }));
  }

  // 根據site獲取廠商
  getFactorys(site) {
    return this._http.get('./../../../../../../assets/temp-data/select.json').toPromise().then(res => {
      console.log(res);
      return res['factory'];
    });
  }

  // 獲取產品別
  getProductCates(site, factory) {
    return this._http.get('./../../../../../../assets/temp-data/select.json').toPromise().then(res => {
      return res['productCate'];
    });
  }

  // 獲取客戶別
  getCustomes(site, factory, productCate) {
    return this._http.get('./../../../../../../assets/temp-data/select.json').toPromise().then(res => {
      return res['custome'];
    });
  }

  // 獲取機種
  getModels() {
    return this._http.get('./../../../../../../assets/temp-data/select.json').toPromise().then(res => {
      return res['model'];
    });
  }

  // 獲取廠商
  getFactoryUser() {
    return this._http.get('./../../../../../../assets/temp-data/select.json').toPromise().then(res => {
      return res['factory'];
    });
  }

  // 獲取品名
  getProNames() {
    return this._http.get('./../../../../../../assets/temp-data/select.json').toPromise().then(res => {
      return res['proName'];
    });
  }

  // 獲取料號
  getMaterialNos() {
    return this._http.get('./../../../../../../assets/temp-data/select.json').toPromise().then(res => {
      return res['materialNo'];
    });
  }
}
