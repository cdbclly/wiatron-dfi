import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { NewmaterialService } from './newmaterial.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import * as XLSX from 'xlsx';
import { YrGenerateService } from '../../yr-generate/yr-generate.service';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-newmaterial-yr-maintain',
  templateUrl: './newmaterial-yr-maintain.component.html',
  styleUrls: ['./newmaterial-yr-maintain.component.scss']
})
export class NewmaterialYrMaintainComponent implements OnInit, OnDestroy {
  validateForm: FormGroup;
  isLoading = false;
  materialYr = []; // 存放表View_ModelMaterial的所有數據
  sites = []; // 存放去重的廠別
  customers = []; // 存放去重的客戶別
  products = []; // 存放去重的產品
  modelIds = []; // 存放去重的ProjectName
  projectId;
  materialIds = [];
  selectSite;
  selectCustomer;
  selectProduct;
  selectProjectName;
  isVisible = false;
  selectTable = []; // 存放Query后的數據
  materialId;
  factorTypes = []; // 存放項目因子
  tableshow = false;
  factor;
  factorIds = [];
  Table = [];
  editCache: { [key: string]: any } = {};
  canEdit = true;
  userId;
  destroy$ = new Subject();
  trans = {};

  constructor(
    private fb: FormBuilder,
    private newMaterialYrService: NewmaterialService,
    private message: NzMessageService,
    private modalService: NzModalService,
    private yrGenerateService: YrGenerateService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    // 初始化I18N;
    this.translate.get(['dfq.signing-please-do-not-modify', 'dfq.send-sign-in-time']).subscribe(res => {
      this.trans['signingNomodify'] = res['dfq.signing-please-do-not-modify'];
      this.trans['singInTime'] = res['dfq.send-sign-in-time'];
    });
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(cur => {
      this.translate.get(['dfq.signing-please-do-not-modify', 'dfq.send-sign-in-time']).subscribe(res => {
        this.trans['signingNomodify'] = res['dfq.signing-please-do-not-modify'];
        this.trans['singInTime'] = res['dfq.send-sign-in-time'];
      });
    });
    this.validateForm = this.fb.group({
      selectSite: [null, [Validators.required]],
      selectCustomer: [null, [Validators.required]],
      selectProduct: [null, [Validators.required]],
      selectProjectName: [null, [Validators.required]],
      projectId: [null, [Validators.required]],
    });
    this.getNewMaterialYr();
    this.userId = localStorage.getItem('$DFI$userID');
  }

  getNewMaterialYr() {
    this.newMaterialYrService.getNewMaterialYr().subscribe(async res => {
      this.materialYr = res;
      for (const item of res) {
        // 去重
        if (!this.sites.includes(item.site + '-' + item.plant)) {
          this.sites.push(item.site + '-' + item.plant);
        }
      }
    });
  }

  siteChange() {
    this.selectCustomer = '';
    this.selectProduct = '';
    this.selectProjectName = '';
    this.projectId = '';
    this.customers.length = 0;
    this.modelIds = [];
    this.newMaterialYrService
      .getCustomer(this.selectSite)
      .subscribe(res => {
        for (let index = 0; index < res.length; index++) {
          if (!this.customers.includes(res[index].customer)) {
            this.customers.push(res[index].customer);
          }
        }
      });
  }

  customerChange() {
    this.selectProduct = '';
    this.selectProjectName = '';
    this.projectId = '';
    this.products.length = 0;
    this.modelIds = [];
    this.newMaterialYrService
      .getProduct(this.selectSite, this.selectCustomer)
      .subscribe(res => {
        for (let index = 0; index < res.length; index++) {
          if (!this.products.includes(res[index].product)) {
            this.products.push(res[index].product);
          }
        }
      });
  }

  productChange() {
    this.selectProjectName = '';
    this.projectId = '';
    this.modelIds.length = 0;
    let plant;
    if (this.selectSite) {
      plant = this.selectSite.split('-')[1];
    }
    this.getRFiModel(plant, this.selectProduct, this.selectCustomer);
  }

  change() {
    if (this.selectProjectName) {
      this.newMaterialYrService
        .getProjectId(this.selectProjectName)
        .subscribe(res => {
          this.projectId = res[0].projectId;
        });
    }
  }

  // 根據廠別，客戶別，產品，機種查詢
  async queryMaterial() {
    this.isLoading = true;
    for (const i in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(i)) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }
    if (
      !!this.selectSite &&
      !!this.selectCustomer &&
      !!this.selectProduct &&
      !!this.selectProjectName
    ) {
      this.Table = await this.newMaterialYrService
        .getMaterialYr(
          this.selectSite,
          this.selectCustomer,
          this.selectProduct,
          this.selectProjectName,
          1,
          0
        )
        .toPromise();
      for (let index = 0; index < this.Table.length; index++) {
        await this.newMaterialYrService.getViewMaterialUpLoad(this.selectSite, this.selectCustomer, this.selectProduct, this.selectProjectName, this.Table[index]['materialId']).toPromise().then(res => {
          if (res.length > 0) {
            this.Table[index]['QAyieldRate'] = res[0].yieldRate,
              this.Table[index].workflowId = res[0].workflowId,
              this.Table[index].status = res[0].status,
              this.Table[index]['uploadId'] = res[0].id;
          } else {
            this.Table[index]['QAyieldRate'] = null,
              this.Table[index].workflowId = null,
              this.Table[index].status = null,
              this.Table[index]['uploadId'] = null;
          }
        });
      }
      // 判斷過濾掉簽核通過的資料不顯示status=1。
      this.selectTable = this.Table.filter(item => item.status !== 1);
      this.updateEditCache();
      this.isLoading = false;
      this.tableshow = true;
    } else {
      this.message.create('error', 'Please select all fields!');
      this.isLoading = false;
      this.selectTable = [];
    }
  }

  // 下載表格
  download() {
    if (this.selectTable.length === 0) {
      this.message.create('error', 'No Data!');
    } else {
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.selectTable);
      /* generate workbook and add the worksheet */
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      /* save to file */
      XLSX.writeFile(wb, '新物料良率.xlsx');
    }
  }

  // 點擊詳情 顯示項目和因子
  showFactor(i): void {
    this.materialId = this.selectTable[i].material.id;
    this.newMaterialYrService.getFactorType(this.materialId).subscribe(res => {
      this.factorTypes = res;
      this.newMaterialYrService.getFactors(this.selectTable[i].id).subscribe(reso => {
        for (let index = 0; index < this.factorTypes.length; index++) {
          this.factorTypes[index].factorId = reso[index]['factorId'];
        }
        this.isVisible = true;
      });
    });
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  startEdit(id: string): void {
    this.editCache[id].edit = true;
    this.editCache[id].data.QAyieldRate = this.editCache[id].data.QAyieldRate * 100;
  }

  cancelEdit(id: string): void {
    const index = this.selectTable.findIndex(item => item.id === id);
    this.editCache[id] = {
      data: { ...this.selectTable[index] },
      edit: false
    };
  }

  saveEdit(id: string): void {
    this.modalService.confirm({
      nzTitle: '<i>Save Alert</i>',
      nzContent: '<b>Do you Want to Save?</b>',
      nzOkText: 'Ok',
      nzCancelText: 'Cancel',
      nzOnCancel: () => { this.editCache[id].edit = false; },
      nzOnOk: async () => {
        this.canEdit = false;
        const index = this.selectTable.findIndex(item => item.id === id);
        Object.assign(this.selectTable[index], this.editCache[id].data);
        this.editCache[id].edit = false;
        // 簽核中請勿修改,改變簽核狀態status為null;
        if (this.selectTable[index].status === 0) {
          this.message.create('error', this.selectTable[index]['modelId'] + this.trans['signingNomodify']);
          this.canEdit = true;
          return;
        } else {
          this.selectTable[index].status = null;
          // 保存后存入modelMaterialUpload維護的良率
          const data = {
            id: this.selectTable[index].uploadId,
            modelId: this.selectTable[index].modelId,
            materialId: this.selectTable[index].materialId,
            workflowId: this.selectTable[index].workflowId,
            yieldRate: this.numDiv(this.selectTable[index].QAyieldRate, 100),
            pic: this.userId,
            siteId: this.selectTable[index].site,
            plantId: this.selectTable[index].plant,
          };
          const viewModelMaterialupload = await this.newMaterialYrService.updateViewMaterialUpLoad(data).toPromise();
          // 存因子進es
          const facters = [];
          await this.newMaterialYrService.getFactorType(this.selectTable[index].materialId).toPromise().then(factorTypes => {
            this.newMaterialYrService.getFactors(this.selectTable[index].id).toPromise().then(async reso => {
              for (let j = 0; j < factorTypes.length; j++) {
                facters[j] = reso[j]['factorId'];
              }
              const esData = await this.yrGenerateService.getEsByModelMaterialId(viewModelMaterialupload['id']).toPromise();
              if (esData['hits']['hits'].length > 0) {
                this.message.create('success', 'Successfully modified' + this.trans['singInTime']);
                this.queryMaterial();
                this.canEdit = true;
              } else {
                this.yrGenerateService.addEsData(viewModelMaterialupload['id'], facters).toPromise().then(re => {
                  this.message.create('success', 'Successfully modified!' + this.trans['singInTime']);
                  this.queryMaterial();
                  this.canEdit = true;
                });
              }
            });
          });
        }
      }
    });
  }

  numDiv(num1, num2) {
    let baseNum1 = 0, baseNum2 = 0;
    let baseNum3, baseNum4;
    try {
      baseNum1 = num1.toString().split('.')[1].length;
    } catch (e) {
      baseNum1 = 0;
    }
    try {
      baseNum2 = num2.toString().split('.')[1].length;
    } catch (e) {
      baseNum2 = 0;
    }
    baseNum3 = Number(num1.toString().replace('.', ''));
    baseNum4 = Number(num2.toString().replace('.', ''));
    return (baseNum3 / baseNum4) * Math.pow(10, baseNum2 - baseNum1);
  }

  updateEditCache(): void {
    this.selectTable.forEach(item => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    });
  }

  //  初始化抓取機種下拉框的值從 ProjectCodeProfile和ProjectNameProfile
  getRFiModel(plant?, product?, customer?) {
    this.yrGenerateService.getRFiModel(plant, product, customer).subscribe(res => {
      this.modelIds = res.ProjectModel['model'];
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
