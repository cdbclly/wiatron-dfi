import { Injectable } from '@angular/core';
import { FakeRawdataApi } from '@service/imqm-sdk';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FalseDataService {

  constructor(
    private fakeDataApi: FakeRawdataApi
  ) { }

  getFormList(data, startTime, endTime) {
    return this.fakeDataApi.getList(data, startTime, endTime).pipe(map((res) => {
      console.log(res['result']);
      return res['result'];
    })).toPromise();
  }


  getRawDataBySN(sn) {
    return this.fakeDataApi.get(sn).pipe(map((res) => {
      return res['result'];
    })).toPromise();
  }



  closeForm(sn) {
    return this.fakeDataApi.closedFakedata(sn).pipe(res => {
      return res;
    });
  }



  rejectForm(sn) {
    return this.fakeDataApi.rejectFakedata(sn).pipe(res => {
      return res;
    });
  }


}
