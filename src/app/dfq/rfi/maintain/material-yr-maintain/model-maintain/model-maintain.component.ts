import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Component, OnInit } from '@angular/core';
import { MaterialYrService } from '../material-yr.service';
import { YrGenerateService } from 'app/dfq/rfi/yr-generate/yr-generate.service';

@Component({
  selector: 'app-model-maintain',
  templateUrl: './model-maintain.component.html',
  styleUrls: ['./model-maintain.component.scss']
})
export class ModelMaintainComponent implements OnInit {

  validateForm: FormGroup;
  isLoading = false;
  selectProduct;
  selectPlant;
  selectCustomer;
  selectModel;
  products = [];
  plants = [];
  customers = [];
  models = [];
  isGain;
  firstCycle;
  massProductionData = [];
  tableShow = false;
  tableData = [];
  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private modalService: NzModalService,
    private modelMaintainService: MaterialYrService,
    private yrGenerateService: YrGenerateService
  ) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      selectProduct: [null, [Validators.required]],
      selectPlant: [null],
      selectCustomer: [null],
      selectModel: [null]
    });
    this.selectProduct = undefined;
    this.selectPlant = undefined;
    this.selectCustomer = undefined;
    this.selectModel = undefined;
    this.getViewMassProduction();
    this.firstCycle = '3個月';
  }
  // 初始化加載下拉框
  getViewMassProduction() {
    this.products = [];
    this.plants = [];
    this.customers = [];
    this.models = [];
    const sitePlants = [];
    this.modelMaintainService.getMassProduction({}).subscribe(res => {
      for (let index = 0; index < res.length; index++) {
        sitePlants.push({ 'sitePlant': res[index]['site'] + '-' + res[index]['plant'], 'plant': res[index]['plant'] });
        if (!this.products.includes(res[index]['product'])) {
          this.products.push(res[index]['product']);
        } if (!this.customers.includes(res[index]['customer'])) {
          this.customers.push(res[index]['customer']);
        }
        if (index === res.length - 1) {
          const map = new Map();
          this.plants = sitePlants.filter(item => !map.has(item.sitePlant) && map.set(item.sitePlant, 1));
        }
      }
      // 初始化抓取機種下拉框的值從 ProjectCodeProfile和ProjectNameProfile
      this.yrGenerateService.getRFiBAModel().subscribe(res => {
        this.models = res.ProjectModel['model'];
      });
    });
  }

  getPlants() {
    if (this.selectProduct) {
      this.selectModel = undefined;
      this.plants = [];
      this.models = [];
      const distSitePlants = [];
      this.modelMaintainService.getMassProduction({
        where: {
          product: this.selectProduct
        }
      }).subscribe(res => {
        for (let index = 0; index < res.length; index++) {
          distSitePlants.push({ 'sitePlant': res[index]['site'] + '-' + res[index]['plant'], 'plant': res[index]['plant'] });
          if (index === res.length - 1) {
            const map = new Map();
            this.plants = distSitePlants.filter(item => !map.has(item.sitePlant) && map.set(item.sitePlant, 1));
          }
        }
        // 初始化抓取機種下拉框的值從 ProjectCodeProfile和ProjectNameProfile
        this.yrGenerateService.getRFiBAModel(this.selectPlant, this.selectProduct, this.selectCustomer).subscribe(res => {
          this.models = res.ProjectModel['model'];
        });
      });
    }
  }

  getCustomers() {
    this.customers = [];
    this.modelMaintainService.getMassProduction({
      where: {
        product: this.selectProduct,
        plant: this.selectPlant
      }
    }).subscribe(res => {
      for (let index = 0; index < res.length; index++) {
        if (!this.customers.includes(res[index]['customer'])) {
          this.customers.push(res[index]['customer']);
        }
      }
    });
  }

  getModels() {
    this.selectModel = undefined;
    this.models = [];
    // 初始化抓取機種下拉框的值從 ProjectCodeProfile和ProjectNameProfile
    this.yrGenerateService.getRFiBAModel(this.selectPlant, this.selectProduct, this.selectCustomer).subscribe(res => {
      this.models = res.ProjectModel['model'];
    });
  }

  // 機種改變時
  modelChanges() {
    if (this.selectModel.length === 0) {
      this.query();
    }
  }
  // 根據條件查詢
  query() {
    for (const i in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(i)) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }
    this.isLoading = true;
    this.tableShow = false;
    this.tableData = [];
    if (!this.selectProduct) {
      this.message.create('error', 'Please select a product!');
      this.isLoading = false;
    } if (!this.selectModel) {
      if (this.selectProduct && !this.selectPlant && !this.selectCustomer) {
        this.modelMaintainService.getMassProduction({
          where: {
            product: this.selectProduct
          }
        }).subscribe(res => {
          this.massProductionData = res.filter(d => this.models.includes(d['model']));
          for (let index = 0; index < this.massProductionData.length; index++) {
            if (!!this.massProductionData[index]['cycleTimes']) {
              this.massProductionData[index]['flag1'] = false;
              this.massProductionData[index]['flag2'] = true;
            } else if (!!this.massProductionData[index]['frequency']) {
              this.massProductionData[index]['flag1'] = true;
              this.massProductionData[index]['flag2'] = false;
            } else {
              this.massProductionData[index]['flag1'] = false;
              this.massProductionData[index]['flag2'] = false;
            }
            if (this.massProductionData[index]['id']) {
              this.massProductionData[index]['isGain'] = this.massProductionData[index]['isGain'].toString();
            } else {
              this.massProductionData[index]['isGain'] = '1';
            }
          }
          this.tableShow = true;
          this.isLoading = false;
        });
      } else if (this.selectProduct && this.selectPlant && !this.selectCustomer) {
        this.modelMaintainService.getMassProduction({
          where: {
            product: this.selectProduct,
            plant: this.selectPlant
          }
        }).subscribe(res => {
          this.massProductionData = res.filter(d => this.models.includes(d['model']));
          for (let index = 0; index < this.massProductionData.length; index++) {
            if (!!this.massProductionData[index]['cycleTimes']) {
              this.massProductionData[index]['flag1'] = false;
              this.massProductionData[index]['flag2'] = true;
            } else if (!!this.massProductionData[index]['frequency']) {
              this.massProductionData[index]['flag1'] = true;
              this.massProductionData[index]['flag2'] = false;
            } else {
              this.massProductionData[index]['flag1'] = false;
              this.massProductionData[index]['flag2'] = false;
            }
            if (this.massProductionData[index]['id']) {
              this.massProductionData[index]['isGain'] = this.massProductionData[index]['isGain'].toString();
            } else {
              this.massProductionData[index]['isGain'] = '1';
            }
          }
          this.tableShow = true;
          this.isLoading = false;
        });
      } else if (this.selectProduct && this.selectPlant && this.selectCustomer) {
        this.modelMaintainService.getMassProduction({
          where: {
            product: this.selectProduct,
            plant: this.selectPlant,
            customer: this.selectCustomer
          }
        }).subscribe(res => {
          this.massProductionData = res.filter(d => this.models.includes(d['model']));
          for (let index = 0; index < this.massProductionData.length; index++) {
            if (!!this.massProductionData[index]['cycleTimes']) {
              this.massProductionData[index]['flag1'] = false;
              this.massProductionData[index]['flag2'] = true;
            } else if (!!this.massProductionData[index]['frequency']) {
              this.massProductionData[index]['flag1'] = true;
              this.massProductionData[index]['flag2'] = false;
            } else {
              this.massProductionData[index]['flag1'] = false;
              this.massProductionData[index]['flag2'] = false;
            }
            if (this.massProductionData[index]['id']) {
              this.massProductionData[index]['isGain'] = this.massProductionData[index]['isGain'].toString();
            } else {
              this.massProductionData[index]['isGain'] = '1';
            }
          }
          this.tableShow = true;
          this.isLoading = false;
        });
      }
    } else if (this.selectModel.length === 0) {
      if (this.selectProduct && !this.selectPlant && !this.selectCustomer) {
        this.modelMaintainService.getMassProduction({
          where: {
            product: this.selectProduct
          }
        }).subscribe(res => {
          this.massProductionData = res.filter(d => this.models.includes(d['model']));
          for (let index = 0; index < this.massProductionData.length; index++) {
            if (!!this.massProductionData[index]['cycleTimes']) {
              this.massProductionData[index]['flag1'] = false;
              this.massProductionData[index]['flag2'] = true;
            } else if (!!this.massProductionData[index]['frequency']) {
              this.massProductionData[index]['flag1'] = true;
              this.massProductionData[index]['flag2'] = false;
            } else {
              this.massProductionData[index]['flag1'] = false;
              this.massProductionData[index]['flag2'] = false;
            }
            if (this.massProductionData[index]['id']) {
              this.massProductionData[index]['isGain'] = this.massProductionData[index]['isGain'].toString();
            } else {
              this.massProductionData[index]['isGain'] = '1';
            }
          }
          this.tableShow = true;
          this.isLoading = false;
        });
      } else if (this.selectProduct && this.selectPlant && !this.selectCustomer) {
        this.modelMaintainService.getMassProduction({
          where: {
            product: this.selectProduct,
            plant: this.selectPlant
          }
        }).subscribe(res => {
          this.massProductionData = res.filter(d => this.models.includes(d['model']));
          for (let index = 0; index < this.massProductionData.length; index++) {
            if (!!this.massProductionData[index]['cycleTimes']) {
              this.massProductionData[index]['flag1'] = false;
              this.massProductionData[index]['flag2'] = true;
            } else if (!!this.massProductionData[index]['frequency']) {
              this.massProductionData[index]['flag1'] = true;
              this.massProductionData[index]['flag2'] = false;
            } else {
              this.massProductionData[index]['flag1'] = false;
              this.massProductionData[index]['flag2'] = false;
            }
            if (this.massProductionData[index]['id']) {
              this.massProductionData[index]['isGain'] = this.massProductionData[index]['isGain'].toString();
            } else {
              this.massProductionData[index]['isGain'] = '1';
            }
          }

          this.tableShow = true;
          this.isLoading = false;
        });
      } else if (this.selectProduct && this.selectPlant && this.selectCustomer) {
        this.modelMaintainService.getMassProduction({
          where: {
            product: this.selectProduct,
            plant: this.selectPlant,
            customer: this.selectCustomer
          }
        }).subscribe(res => {
          this.massProductionData = res.filter(d => this.models.includes(d['model']));
          for (let index = 0; index < this.massProductionData.length; index++) {
            if (!!this.massProductionData[index]['cycleTimes']) {
              this.massProductionData[index]['flag1'] = false;
              this.massProductionData[index]['flag2'] = true;
            } else if (!!this.massProductionData[index]['frequency']) {
              this.massProductionData[index]['flag1'] = true;
              this.massProductionData[index]['flag2'] = false;
            } else {
              this.massProductionData[index]['flag1'] = false;
              this.massProductionData[index]['flag2'] = false;
            }
            if (this.massProductionData[index]['id']) {
              this.massProductionData[index]['isGain'] = this.massProductionData[index]['isGain'].toString();
            } else {
              this.massProductionData[index]['isGain'] = '1';
            }
          }
          this.tableShow = true;
          this.isLoading = false;
        });
      }
    } else {
      if (this.selectProduct && !this.selectPlant && !this.selectCustomer) {
        this.modelMaintainService.getMassProduction({
          where: {
            product: this.selectProduct,
            model: { inq: this.selectModel }
          }
        }).subscribe(res => {
          this.massProductionData = res.filter(d => this.models.includes(d['model']));
          for (let index = 0; index < this.massProductionData.length; index++) {
            if (!!this.massProductionData[index]['cycleTimes']) {
              this.massProductionData[index]['flag1'] = false;
              this.massProductionData[index]['flag2'] = true;
            } else if (!!this.massProductionData[index]['frequency']) {
              this.massProductionData[index]['flag1'] = true;
              this.massProductionData[index]['flag2'] = false;
            } else {
              this.massProductionData[index]['flag1'] = false;
              this.massProductionData[index]['flag2'] = false;
            }
            if (this.massProductionData[index]['id']) {
              this.massProductionData[index]['isGain'] = this.massProductionData[index]['isGain'].toString();
            } else {
              this.massProductionData[index]['isGain'] = '1';
            }
          }
          this.tableShow = true;
          this.isLoading = false;
        });
      } else if (this.selectProduct && this.selectPlant && !this.selectCustomer) {
        this.modelMaintainService.getMassProduction({
          where: {
            product: this.selectProduct,
            plant: this.selectPlant,
            model: { inq: this.selectModel }
          }
        }).subscribe(res => {
          this.massProductionData = res.filter(d => this.models.includes(d['model']));
          for (let index = 0; index < this.massProductionData.length; index++) {
            if (!!this.massProductionData[index]['cycleTimes']) {
              this.massProductionData[index]['flag1'] = false;
              this.massProductionData[index]['flag2'] = true;
            } else if (!!this.massProductionData[index]['frequency']) {
              this.massProductionData[index]['flag1'] = true;
              this.massProductionData[index]['flag2'] = false;
            } else {
              this.massProductionData[index]['flag1'] = false;
              this.massProductionData[index]['flag2'] = false;
            }
            if (this.massProductionData[index]['id']) {
              this.massProductionData[index]['isGain'] = this.massProductionData[index]['isGain'].toString();
            } else {
              this.massProductionData[index]['isGain'] = '1';
            }
          }
          this.tableShow = true;
          this.isLoading = false;
        });
      } else if (this.selectProduct && this.selectPlant && this.selectCustomer) {
        this.modelMaintainService.getMassProduction({
          where: {
            product: this.selectProduct,
            plant: this.selectPlant,
            customer: this.selectCustomer,
            model: { inq: this.selectModel }
          }
        }).subscribe(res => {
          this.massProductionData = res.filter(d => this.models.includes(d['model']));
          for (let index = 0; index < this.massProductionData.length; index++) {
            if (!!this.massProductionData[index]['cycleTimes']) {
              this.massProductionData[index]['flag1'] = false;
              this.massProductionData[index]['flag2'] = true;
            } else if (!!this.massProductionData[index]['frequency']) {
              this.massProductionData[index]['flag1'] = true;
              this.massProductionData[index]['flag2'] = false;
            } else {
              this.massProductionData[index]['flag1'] = false;
              this.massProductionData[index]['flag2'] = false;
            }
            if (this.massProductionData[index]['id']) {
              this.massProductionData[index]['isGain'] = this.massProductionData[index]['isGain'].toString();
            } else {
              this.massProductionData[index]['isGain'] = '1';
            }
          }
          this.tableShow = true;
          this.isLoading = false;
        });
      }
    }
  }

  save(item) {
    if (!item['cycleTimes'] && !item['frequency']) {
      this.message.create('error', '請填寫撈取次數或者撈取頻率！Please fill in the number of get times or get frequency!');
    } else {
      item['id'] = item['id'] ? item['id'] : undefined;
      item['doneTimes'] = (item['doneTimes'] || item['doneTimes'] === 0) ? item['doneTimes'] : undefined;
      if (!item['cycleTimes']) {
        item['cycleTimes'] = null;
      } else if (!item['frequency']) {
        item['frequency'] = null;
      }
      this.modalService.confirm({
        nzTitle: '<i>Save Alert</i>',
        nzContent: '<b>Do you Want to Save?</b>',
        nzOkText: 'Ok',
        nzCancelText: 'Cancel',
        nzOnOk: () => {
          const form = {
            id: item['id'],
            plant: item['plant'],
            modelId: item['model'],
            isGain: item['isGain'],
            cycleTimes: item['cycleTimes'],
            frequency: item['frequency'],
            doneTimes: item['doneTimes']
          };
          this.modelMaintainService.updateModelSchedule(form).subscribe(res => {
            this.message.create('success', 'save success！');
          });
        }
      });
    }
  }

  isDisabled(item) {
    if (item.cycleTimes) {
      item.flag2 = true;
    } else if (item.cycleTimes === '') {
      item.flag2 = false;
    }
  }
  isDisabled1(item) {
    if (item.frequency) {
      item.flag1 = true;
    } else if (item.frequency === '') {
      item.flag1 = false;
    }
  }

}



