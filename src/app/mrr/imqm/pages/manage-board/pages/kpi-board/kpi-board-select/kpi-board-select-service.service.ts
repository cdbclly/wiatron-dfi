import { Injectable } from '@angular/core';
import { SelectMenuApi } from '@service/imqm-sdk';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class KpiBoardSelectServiceService {

  constructor(private selectService: SelectMenuApi) { }

  // 獲取site 下拉框資料
  getSelectDatas(data?) {
    return this.selectService.getSelectMenu(data).pipe(map((res) => {
      console.log(res['result']);
      return res['result'];
    }));
  }

  getSitePlantGroup() {
    return this.selectService.find({fields: {site: true, plant: true}}).pipe(map((res) => {
      const siteInfoArr = [];
      const obj = {};
      return res.reduce((prev: any, next) => {
        obj[next['site'] + '-' + next['plant']] ? '' : obj[next['site'] + '-' + next['plant']] = true && prev.push({site: next['site'], plant: next['plant']});
        return prev;
      }, []);
    }));
  }
}
