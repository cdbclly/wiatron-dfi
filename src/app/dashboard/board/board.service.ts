import { BusinessGroupApi } from './../../service/dfi-sdk/services/custom/BusinessGroup';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class BoardService {

  constructor(
    private bgService: BusinessGroupApi,

  ) { }

  getBg() {
    return this.bgService.find();
  }

}
