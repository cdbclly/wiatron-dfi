import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MaterialYrService } from '../../maintain/material-yr-maintain/material-yr.service';
import { YrGenerateService } from '../../yr-generate/yr-generate.service';
import { Utils } from 'app/dfq/utils';
import { BaseDataSigningService } from './base-data-signing.service';

@Component({
  selector: 'app-base-data-signing',
  templateUrl: './base-data-signing.component.html',
  styleUrls: ['./base-data-signing.component.scss']
})
export class BaseDataSigningComponent implements OnInit {
  validateForm: FormGroup;
  editCache: { [key: string]: any } = {};
  tableShow = false;
  isLoading = false;
  detialsShow = false;
  selectProduct;
  selectModel;
  selectStatus;
  selectTable = [];
  View_ModelMaterial;
  Product = [];             // 下拉框去重取ViewModelMaterial表里所有的產品別
  Model = [];               //  下拉框去重取ViewModelMaterial表里所有的機種
  editmodelMaterial;  // 點擊那一行的資料傳給子頁面
  showModalTable = false;

  Status = ['未簽核', '簽核通過', '簽核未通過', '簽核中'];
  product: {}[];
  allData = [];
  noFlowIdDataLength: number;

  constructor(
    private fb: FormBuilder,
    private materialYrService: MaterialYrService,
    private yrGenerateService: YrGenerateService,
    private route: ActivatedRoute,
    private baseDataSigningService: BaseDataSigningService
  ) {
    this.route.queryParams.subscribe(params => {
      if (params['product'] && params['model']) {
        this.selectProduct = params['product'];
        this.selectModel = params['model'];
        this.query();
      }
    });
  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      selectProduct: [null],
      selectModel: [null],
      selectStatus: [null]
    });
    this.getViewModelMaterial();
  }

  // 獲取下拉框所有值
  async getViewModelMaterial() {
    this.View_ModelMaterial = await this.materialYrService.getModelMaterial().toPromise();
    for (const ONE of this.View_ModelMaterial) {
      if (!this.Product.includes(ONE.product)) {
        this.Product.push(ONE.product);
      }
      // if (!this.Model.includes(ONE.modelId)) {
      //   this.Model.push(ONE.modelId);
      // }
    }
    // 初始化抓取機種下拉框的值從 ProjectCodeProfile和ProjectNameProfile
    this.Model = [];
    this.yrGenerateService.getRFiBAModel().subscribe(data => {
      this.Model = data.ProjectModel['model'];
    });
  }

  trans() {
    this.detialsShow = false;
    this.query();
  }

  productChange() {
    // 根據產品別 抓取機種下拉框的值從 ProjectCodeProfile和ProjectNameProfile
    this.Model = [];
    this.yrGenerateService.getRFiBAModel(null, this.selectProduct).subscribe(data => {
      this.Model = data.ProjectModel['model'];
    });
  }

  // 查詢
  async query() {
    for (const i in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(i)) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }
    this.tableShow = false;
    this.isLoading = true;
    let status;
    if (!this.selectProduct) {
      this.selectProduct = undefined;
    }
    if (!this.selectModel) {
      this.selectModel = undefined;
    }
    if (!this.selectStatus) {
      this.selectStatus = undefined;
    } else {
      if (this.selectStatus === '簽核通過') {
        status = 1;
      } else if (this.selectStatus === '簽核未通過') {
        status = 2;
      } else if (this.selectStatus === '簽核中') {
        status = 0;
      } else if (this.selectStatus === '未簽核') {
        status = null;
      }
    }
    await this.materialYrService.getFactorType2(this.selectProduct, this.selectModel, status).toPromise().then(async reso => {
      const result = reso.filter(d => this.Model.includes(d['modelId']));
      const group = Utils.groupBy(result, 'modelId');
      this.selectTable.length = 0;
      for (const key in group) {
        if (group.hasOwnProperty(key)) {
          for (let index = 0; index < group[key].length; index++) {
            if (this.selectTable.filter(item => item.site === group[key][index]['site'] && item.plant === group[key][index]['plant']
              && item.product === group[key][index]['product'] && item.modelId === group[key][index]['modelId']).length === 0) {
              this.selectTable.push(group[key][index]);
            }
          }
        }
      }
      this.updateEditCache();
      this.tableShow = true;
      this.isLoading = false;
    });
  }

  // 點擊機種,根據機種的名字查詢物料的信息
  async showModal(id: string, product: string, site: string, plant: string, customer: string) {
    await this.materialYrService.getModelUploadByModel(id).toPromise().then(async res => {
      this.noFlowIdDataLength = null;
      this.allData = res;
      const flowIds = [];
      res.forEach(element => {
        if (flowIds.indexOf(element['workflowId']) === -1) {
          flowIds.push(element['workflowId']);
        }
      });
      this.baseDataSigningService.getflow('RFI物料良率:' + id).subscribe(resd => {
        if (flowIds.length === 3 && resd[0]['status'] === null) {
          this.noFlowIdDataLength = res.filter(item => item['workflowId'] === resd[0]['id']).length;
        }
        if (resd.length !== 0 && resd[0]['status'] !== null) {
          this.editmodelMaterial = res.filter(item => item['workflowId'] === resd[0]['id']);
        } else if (resd.length !== 0 && resd[0]['status'] === null) {
          this.editmodelMaterial = res.filter(item => item['workflowId'] === null);
        } else {
          this.editmodelMaterial = res;
        }
        this.editmodelMaterial.product = product;
        this.editmodelMaterial.site = site;
        this.editmodelMaterial.plant = plant;
        this.editmodelMaterial.customer = customer;
        this.editmodelMaterial.model = id;
        this.showModalTable = true;
        this.detialsShow = true;
      });
    });
  }

  // 保存修改
  async saveEdit(id: string) {
    const index = this.selectTable.findIndex(item => item.id === id);
    Object.assign(this.selectTable[index], this.editCache[id].data);
    this.editCache[id].edit = false;
  }

  finishSign(evt) {
    this.detialsShow = evt;
    this.query();
  }

  updateEditCache(): void {
    for (const item of this.selectTable) {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    }
  }
}
