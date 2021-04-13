import { Injectable } from '@angular/core';
import { SelectMenuApi} from '@service/imqm-sdk';

import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class FilterDataService {

  constructor(private selectService: SelectMenuApi) { }

  //根据当前用户site和plant查询数据
  getFilterDataByUserinfo(site?, plant?){
    return this.selectService.find({where: {and: [{site: site}, {plant: plant}]}}).pipe(map(res => {
        console.log(res);
        return res;
      }));
  }

   //根据筛选栏位查询数据
   getFilterDataBySearch(condition){
    return this.selectService.find(condition).pipe(map(res => {
        console.log(res);
        return res;
      }));
  }

  //delete data
  deleteMaintainDataById(deleteId, UserId){
    return this.selectService.deleteSelectMenu(deleteId, UserId).subscribe(res =>{
      console.log(res);
      return res;
    })
    // return this.selectService.deleteById(id).subscribe(res => {
    //   console.log(res);
    // });
  }

  addOneData(data) {
    return this.selectService.create(data).toPromise();
  }


  updateData(data) {
    // return this.selectService.upsert(data).toPromise();
    return this.selectService.upsert(data);
  }


  updateMany(data) {
    return this.selectService.updateMany(data).toPromise();
  }


}
