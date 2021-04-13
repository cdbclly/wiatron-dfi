import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToolkitService {

  private tranSubject: Subject<{key: string, value: string}> = new Subject();
  constructor(private translate: TranslateService) { }

  assembleHeadWidth(origin: any[], len: any[]) {
    const newWidth = len.reduce((pre, cur) => {
      return [...pre, ...new Array(cur['len'] * 2).fill(cur['somePx'])];
    }, origin);
    return newWidth;
  }

  assembleSelectObject(site, plant?, product?, customer?, model?, vendor?, productName?, partNumber?) {
    return {
      site: site,
      plant: plant,
      product: product,
      customer: customer,
      model: model,
      vendor: vendor,
      productName: productName,
      partNumber: partNumber
    };
  }

  guid() {
    function S4() {
       return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4());
   }

   public groupBy(data, key) {
    return data.reduce(function (total, current) {
      (total[current[key]] = total[current[key]] || []).push(current);
      return total;
    }, {});
  }

  flattenArray(arr) {
    return arr.reduce((pre, cur) => {
      if (Array.isArray(cur)) {
        pre = pre.concat(cur);
      } else {
        pre.push(cur);
      }
      return pre;
    }, []);
  }
}
