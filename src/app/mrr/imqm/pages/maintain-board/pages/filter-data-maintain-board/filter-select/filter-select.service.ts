import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SelectMenuApi } from '@service/imqm-sdk';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class FilterSelectService {

  constructor(private _http: HttpClient, private selectService: SelectMenuApi) { }
  getSelectDatas(data?) {
    return this.selectService.getSelectMenu(data).pipe(map((res) => {
      console.log(res['result']);
      return res['result'];
    }));
  }
}
