import { Injectable } from '@angular/core';
import { forkJoin } from 'rxjs';
import { VendorProductDocumentApi, VendorDocumentApi } from '@service/mrr-sdk';

@Injectable({
  providedIn: 'root'
})
export class FileMaintainBypassService {

  constructor(
    private vendorProductDocumentApi: VendorProductDocumentApi,
    private vendorDocumentApi: VendorDocumentApi
  ) { }

  // by廠別查詢
  getVendorProductDocumentByPlant(plant) {
    return this.vendorProductDocumentApi.find(
      { where: { plant: plant } }
    );
  }

  getAllFiles() {
    return this.vendorDocumentApi.find();
  }

  // 根據文件id查詢
  getVendorProductDocument(idArr) {
    return this.vendorProductDocumentApi.find(
      {
        where: {
          vendorDocumentId: { inq: idArr }
        }
      });
  }

  updateSwitchValue(data) {
    const date = new Date();
    const userId = localStorage.getItem('$DFI$userID');
    return forkJoin(
      data.map(d => {
        const param = {
          pass: d['pass'],
          updatedDate: date,
          updatedBy: userId
        };
        return this.vendorProductDocumentApi.patchAttributes(d.id, param);
      })
    );
  }
}
