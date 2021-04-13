import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { TraceBackApi, SelectMenuApi, ParameterSettingApi} from '@service/imqm-sdk';
import { map } from 'rxjs/operators';
import { MachineModelService } from '../real-time-board/pages/machine-model/machine-model.service';

@Injectable({
  providedIn: 'root'
})
export class TraceBoardService {

  constructor(private http: HttpClient,
    private traceBackService: TraceBackApi,
    private selectService: SelectMenuApi,
    private paramService: ParameterSettingApi
  ) { }

  async getInitData() {
    let ngData;
    let startDate;
    let endDate;

    // 測試用
    startDate = 1559552855;
    endDate = 1562284800;

    ngData = await this.traceBackService.getListByGroup('model', {}, startDate, endDate).toPromise();

    return {ngData: ngData['result']};
  }

  getInitialData() {
    return this.http.get('./../../../../../assets/temp-data/trace-board.json').toPromise();
  }

  getTraceListByGroup(serachType, site, plant, product, customer, model, vendor, productName, partNumber, startTime, endTime) {
    // 測試用
    // startTime = 1559552855;
    // endTime = 1562284800;

    return this.traceBackService.getListByGroup(serachType, {site: site, plant: plant, product: product, customer: customer, model: model ? model : undefined, vendor: vendor ? vendor : undefined, productName: productName ? productName : undefined, partNumber: partNumber ?　partNumber : undefined}, Math.ceil(startTime / 1000), Math.ceil(endTime / 1000)).pipe(map(res => {
      console.log(res['result']);
      return res['result'];
    }));
  }

  getTraceBackList(site, plant, product, customer, status, model, productName, partNumber, vendor, startTime, endTime) {
    // 測試用
    // startTime = 1559552855;
    // endTime = 1562284800;
    console.log({site: site, plant: plant, product: product, customer: customer, status: status, model: model ? model : undefined, productName: productName ? productName : undefined, partNumber: partNumber ?　partNumber : undefined}, startTime, endTime);
    return this.traceBackService.getList({site: site, plant: plant, product: product, customer: customer, status: status, model: model ? model : undefined, productName: productName ? productName : undefined, partNumber: partNumber ?　partNumber : undefined, vendor: vendor ? vendor : undefined}, Math.ceil(startTime / 1000), Math.ceil(endTime / 1000)).pipe(map(res => {
      console.log(res['result']);
      return res['result'];
    }));
  }

  getTraceBackRawDataBySN(sn) {
    return this.traceBackService.get(sn).pipe(map(res => {
      return res['result'];
    }));
  }

  getSelectInfoByPartNo(partNo) {
    // console.log(partNo);
    return this.selectService.find({where: {partNumber: partNo}}).toPromise();
  }

  getYrTarget(site, plant, model, partNo) {
    return this.paramService.getInfo({type: 'yrTarget', site: site, plant: plant, product: '*', model: model,
    productName: '*', partNumber: partNo}).pipe(map((res) => {
      console.log(res['result']);
      return res['result'];
    })).toPromise();
  }
}

@Injectable()
export class TraceBoardResolve implements Resolve<any> {

  constructor(
    private _service: TraceBoardService
  ) { }

  resolve(_route: ActivatedRouteSnapshot) {
    return this._service.getInitData();
  }
}
