import { Injectable } from '@angular/core';
import { SelectMenuApi } from '@service/imqm-sdk';

@Injectable({
  providedIn: 'root'
})
export class MaterialEndProductService {

  constructor(
    private selectService: SelectMenuApi
  ) { }

  getSelectInfoByPartNo(partNo) {
    console.log(partNo);
    return this.selectService.find({where: {partNumber: partNo}}).toPromise();
  }
}
