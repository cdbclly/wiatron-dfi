import { Injectable } from '@angular/core';
import { SelectMenuApi } from '@service/imqm-sdk';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class SelectService {

  constructor(private _http: HttpClient, private selectService: SelectMenuApi) { }

    // 獲取site 下拉框資料
    getSelectDatas(data?) {
      return this.selectService.getSelectMenu(data).pipe(map((res) => {
        console.log(res['result']);
        return res['result'];
      }));
    }
}
