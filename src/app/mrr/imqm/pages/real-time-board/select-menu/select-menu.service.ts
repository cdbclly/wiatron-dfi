import { Injectable } from '@angular/core';
import { SelectMenuApi } from '@service/imqm-sdk';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SelectMenuService {

  constructor(
    private selectService: SelectMenuApi
  ) { }

  // 获取site plant
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
