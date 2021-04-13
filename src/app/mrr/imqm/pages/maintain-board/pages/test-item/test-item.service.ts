import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TestItemDetailApi, TestItemGroupApi } from '@service/imqm-sdk';

@Injectable({
  providedIn: 'root'
})
export class TestItemService {

  constructor(
    private detailApi: TestItemDetailApi,
    private groupApi: TestItemGroupApi,
    private _http: HttpClient
  ) { }


  // 获取测项群组数据
  getTestGroupData(data) {
    // site, plant, product, customer, model, vendor, productName, partNumber, startTime, endTime
    return this.groupApi.find({
      where: {
        site: data.site, plant: data.plant, product: data.product, customer: data.customer,
        model: data.model, vendor: data.vendor, productName: data.productName, partNumber: data.partNumber,
        updatedTime: { between: [data.startTime, data.endTime] }
      }, include: 'TestItemDetail'
    }).toPromise();
  }

  // 测项群组状态变化
  groupStatusChange(data) {
    return this.groupApi.upsert(data);
    // return this.groupApi.upsert(data).toPromise();

  }
  // 新增测试项数据
  addItemTestData(data) {
    return this.detailApi.create(data).toPromise();
  }

  // 修改测试项数据
  updateItemTestData(data) {
    return this.detailApi.upsert(data).toPromise();
  }

  // 上传execl数据
  uploadExcelData(data: Array<any>, groupId) {
    return this.detailApi.uploadSetting(data, groupId).toPromise();
  }

  // 多个状态修改
  updateMany(data) {
    return this.detailApi.updateMany(data).toPromise();
  }

  // 获取config中的模板文件
  getTemplateFile() {
    return this._http.get('../../../../../../../assets/imqm/testItemTemplateFile.json?' + 'noCache =' + new Date().getTime());
  }

}
