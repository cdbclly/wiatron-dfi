import { YieldRateApi } from '@service/imqm-sdk';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DownloadRawdataService {

  constructor(
    private downloadRawdata: YieldRateApi
  ) { }


  getRawdataList(data, startTime, endTime) {
    return this.downloadRawdata.getRawdataList(data, startTime, endTime).pipe(map ((res) => {
      // console.log(res['result']);
      return res['result'];
    }));
  }



}
