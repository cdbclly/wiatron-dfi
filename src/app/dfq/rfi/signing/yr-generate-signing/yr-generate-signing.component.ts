import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MaterialYrService } from '../../maintain/material-yr-maintain/material-yr.service';
import { NzMessageService } from 'ng-zorro-antd';
import { ActivatedRoute } from '@angular/router';
import { YrGenerateService } from '../../yr-generate/yr-generate.service';



@Component({
  selector: 'app-yr-generate-signing',
  templateUrl: './yr-generate-signing.component.html',
  styleUrls: ['./yr-generate-signing.component.scss']
})
export class YrGenerateSigningComponent implements OnInit {
  validateForm: FormGroup;
  editCache: { [key: string]: any } = {};
  detialsShow = false;
  tableShow = false;
  isLoading = false;
  selectSite;
  selectplant;
  selectCustomer;
  selectProduct;
  selectModel;
  selectProject;
  selectSiging: string;
  Site = [];
  Plant = [];
  Customer = [];
  Product = [];
  Model = [];
  Project = [];
  Siging = ['簽核通過', '簽核未通過', '簽核中', '未簽核'];
  selecTable = [];
  data = [];   // 子頁面需要的數據廠別,客戶別,產品別
  status;      // 签核状态
  plants: any;

  constructor(
    private fb: FormBuilder,
    private materialYrService: MaterialYrService,
    private message: NzMessageService,
    private route: ActivatedRoute,
    private yrGenerateService: YrGenerateService
  ) {
    this.plants = this.route.snapshot.data['plantsResolver'];
  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      selectSite: [null, [Validators.required]],
      selectCustomer: [null],
      selectProduct: [null],
      selectModel: [null],
      selectSiging: [null]
    });
    this.materialYrService.getViewMaterials().subscribe(res => {
      for (const item of res) {
        if (!this.Site.includes(item['site'] + '-' + item['plant'])) {
          this.Site.push(item['site'] + '-' + item['plant']);
        }
        // if (!this.Model.includes(item['modelId'])) {
        //   this.Model.push(item['modelId']);
        // }
        if (!this.Customer.includes(item['customer'])) {
          this.Customer.push(item['customer']);
        }
        if (!this.Product.includes(item['product'])) {
          this.Product.push(item['product']);
        }
      }
      // 初始化抓取機種下拉框的值從 ProjectCodeProfile和ProjectNameProfile
      this.Model = [];
      this.yrGenerateService.getRFiModel().subscribe(data => {
        this.Model = data.ProjectModel['model'];
      });
      this.route.queryParams.subscribe(params => {
        if (params['sitePlant'] && params['projectName']) {
          this.selectSite = params['sitePlant'];
          this.selectModel = params['projectName'];
          this.query();
        }
      });
    });
  }

  // 廠別 客戶別 產品別的值改變時 獲取機種下拉框
  getModels() {
    this.selectModel = '';
    let plant;
    if (this.selectSite) {
      plant = this.selectSite.split('-')[1];
    }
    // 根據所選值 查找機種下拉框的值從 ProjectCodeProfile和ProjectNameProfile
    this.Model = [];
    this.yrGenerateService.getRFiModel(plant, this.selectProduct, this.selectCustomer).subscribe(data => {
      this.Model = data.ProjectModel['model'];
    });
  }

  // 顯示子頁面
  showYieDetail(data) {
    this.data = [];
    this.data = data;
    this.detialsShow = true;
  }

  // 查詢table
  async query() {
    for (const i in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(i)) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }
    this.tableShow = false;
    let Arr1 = [];
    this.isLoading = true;
    if (!this.selectSite) {
      this.message.create('error', 'Please select a plant!');
      this.isLoading = false;
      return;
    } else {
      // Arr1[0], Arr1[1]第一个是Site第二个是Plant
      Arr1 = this.selectSite.split('-');
      if (!this.selectCustomer) { this.selectCustomer = undefined; }
      if (!this.selectProduct) { this.selectProduct = undefined; }
      if (!this.selectModel) { this.selectModel = undefined; }
      if (!this.selectProject) { this.selectProject = undefined; }
      await this.materialYrService.getViewModelYieldRate(Arr1[0], Arr1[1], this.selectCustomer, this.selectProduct, this.selectModel, this.selectProject).toPromise().then(async res => {
        // 過濾新機種信息維護RFi模組要做的機種
        this.selecTable = res.filter(d => this.Model.includes(d['model']));
        if (this.selecTable.length > 0) {
          const optionData = res;
          // 根据model名在wolkflow里查询状态
          for (let index = 0; index < this.selecTable.length; index++) {
            await this.materialYrService.getWorlkflow(this.selecTable[index]['model']).toPromise().then(rea => {
              if (rea.length === 0) {
                this.isLoading = false;
                if (index === this.selecTable.length - 1) {
                  if (this.selectSiging) {
                    if (this.selectSiging === '簽核中') {
                      this.selecTable = optionData.filter(item => item['status'] == 0);
                      this.tableShow = true;
                    } else if (this.selectSiging === '簽核通過') {
                      this.selecTable = optionData.filter(item => item['status'] == 1);
                      this.tableShow = true;
                    } else if (this.selectSiging === '簽核未通過') {
                      this.selecTable = optionData.filter(item => item['status'] == 2);
                      this.tableShow = true;
                    } else if (this.selectSiging === '未簽核') {
                      this.selecTable = optionData.filter(item => item['status'] === null);
                      this.tableShow = true;
                    }
                  } else {
                    this.tableShow = true;
                  }
                }
              } else {
                this.isLoading = false;
                // 判断选择框签核状态
                if (index === this.selecTable.length - 1) {
                  if (this.selectSiging) {
                    if (this.selectSiging === '簽核中') {
                      this.selecTable = optionData.filter(item => item['status'] == 0);
                      this.tableShow = true;
                    } else if (this.selectSiging === '簽核通過') {
                      this.selecTable = optionData.filter(item => item['status'] == 1);
                      this.tableShow = true;
                    } else if (this.selectSiging === '簽核未通過') {
                      this.selecTable = optionData.filter(item => item['status'] == 2);
                      this.tableShow = true;
                    } else if (this.selectSiging === '未簽核') {
                      this.selecTable = optionData.filter(item => item['status'] === null);
                      this.tableShow = true;
                    }
                  } else {
                    this.tableShow = true;
                  }
                }
              }
              this.updateEditCache();
            }
            );
          }
        } else {
          this.isLoading = false;
          this.tableShow = true;
        }
      });
    }
  }

  // 修改
  async startEdit(id: string) {
    this.editCache[id].edit = true;
  }

  // 保存修改
  async saveEdit(id: string) {
    const index = this.selecTable.findIndex(item => item.id === id);
    Object.assign(this.selecTable[index], this.editCache[id].data);
    this.editCache[id].edit = false;
  }

  updateEditCache(): void {
    for (const item of this.selecTable) {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    }
  }

  // 點擊目錄選項返回主頁面
  closeDetial() {
    this.detialsShow = false;
  }
}
