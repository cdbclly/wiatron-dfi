import { Component, OnInit } from '@angular/core';
import { PartApi } from '@service/mrr-sdk';
import { ProductTypeMappingApi } from '@service/dfi-sdk';
import { NzMessageService } from 'ng-zorro-antd';
import { DownexcelService } from '@service/downexcel.service';

@Component({
  selector: 'app-product-type-mapping',
  templateUrl: './product-type-mapping.component.html',
  styleUrls: ['./product-type-mapping.component.scss']
})
export class ProductTypeMappingComponent implements OnInit {
  dataSet = [];
  dfiParts = [];
  manualOptions = ['手動', '自動'];
  addOneFlag = false;
  addPlm;
  confirmLoading = false;
  downLoading = false;
  constructor(
    private message: NzMessageService,
    private downexcelService: DownexcelService,
    private productTypeMappingApi: ProductTypeMappingApi,
    private partApi: PartApi
  ) { }

  ngOnInit() {
    this.getProductTypes();
  }

  getProductTypes() {
    this.productTypeMappingApi.find().subscribe(res => {
      res.forEach(item => {
        item['edit'] = false;
        item['isEditDisabled'] = false;
        item['isIsManualDisabled'] = true;
        if (item['isManual']) {
          item['isManuald'] = '手動';
        } else {
          item['isManuald'] = '自動';
        }
      });
      this.dataSet = res;
      console.log(this.dataSet);
      this.getDfiParts();
    });
  }

  getDfiParts() {
    this.partApi.find().subscribe(res => {
       this.dfiParts = [];
        for (let i = 0; i < res.length; i++) {
          let flag = true;
          let temp = res[i]['productId'];
          for (let j = 0; j < this.dfiParts.length; j++) {
            if (temp === this.dfiParts[j]) {
              flag = false;
              break;
            }
          }
          if (flag) {
            this.dfiParts.push(temp);
          }
        }
    });
  }


  startEdit(data) {
    data.edit = true;
    for (const item of this.dataSet) {  // 禁用非開啟的編輯按鈕
      if (item.id !== data.id) {
        item.isEditDisabled = true;
      }
    }
  }

  dfiProductTypeChange(data, e) {
    if (e) {
      data.isManuald = '自動';
    } else {
      data.isManuald = '手動';
    }
  }



  saveEdit(data) {
    if (data.isManuald === '手動') {
      data.isManual = 1;
    } else {
      data.isManual = 0;
    }
      const newData = {
        id: data.id,
        plmProductType: data.plmProductType,
        dfiProductType: data.dfiProductType,
        isManual: data.isManual,
      };
      this.productTypeMappingApi.upsert(newData).subscribe(res => {
        if (res['isManual']) {
          res['isManuald'] = '手動';
        } else {
          res['isManuald'] = '自動';
        }
        Object.assign(data, res);
        this.dataSet.forEach(item => {
          item['isEditDisabled'] = false;
        });
        data.edit = false;
        this.message.create('success', '修改成功！');
      });

  }

  cancelEdit(data) {
    this.dataSet.forEach(item => {
      item['isEditDisabled'] = false;
    });
    data.edit = false;
  }

  addPlmModel() {
    this.addPlm = null;
    this.addOneFlag = true;
  }

  addOne() {
    this.confirmLoading = true;
    const plmDataList = [];
    if (!this.addPlm) {
      this.message.create('error', `請填寫PLM！`);
      this.confirmLoading = false;
      return;
    } else {
      for (const item of this.dataSet) {
        plmDataList.push(item.plmProductType);
      }
      const index = plmDataList.indexOf(this.addPlm.trim());
      if (index !== -1) {
        this.message.create('error', `已存在${this.addPlm},請勿重複添加！`);
        this.confirmLoading = false;
        return;
      } else {
        const addData = {
          plmProductType: this.addPlm,
          dfiProductType: null,
          isManual: 1,
        };
      this.productTypeMappingApi.create(addData).subscribe(res => {
        res['isManuald'] = '手動';  // 新增默認手動轉
        res['isIsManualDisabled'] = true;
        this.dataSet.push(res);
        this.dataSet = this.dataSet.slice();
        this.confirmLoading = false;
        this.addOneFlag = false;
        this.message.create('success', '添加成功！');
      });
    }
    }


  }

  cancelAddOne() {
    this.addOneFlag = false;
  }


  download() {
    const downLoadData = [];
    const excelFileName = '產品別轉換對照表';
    for (const item of this.dataSet) {
      const Data = {
        plmProductType: item.plmProductType,
        dfiProductType: item.dfiProductType,
        isManual: item.isManuald,
      };
      downLoadData.push(Data);
    }
    this.downexcelService.exportAsExcelFile(downLoadData, excelFileName);
  }


}
