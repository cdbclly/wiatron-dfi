import { ProductDocument } from './../../../service/mrr-sdk/models/ProductDocument';
import { NzMessageService } from 'ng-zorro-antd';
import { MrrDocUploadService } from './mrr-doc-upload.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MrrDocUploadQuery } from './mrr-doc-upload';
import { MrrDocSelectService } from '../mrr-doc-select.service';
import { FileService } from '@service/file.service';
import { Observable, of, Subject } from 'rxjs';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';
import { NewModelDocument } from '@service/mrr-sdk';
import { MrrDocViewService } from '../mrr-doc-view/mrr-doc-view.service';
// DFI SDK
import { LoopBackConfig as DFILoopBackConfig } from '@service/dfi-sdk';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-mrr-doc-upload',
  templateUrl: './mrr-doc-upload.component.html',
  styleUrls: ['./mrr-doc-upload.component.scss']
})
export class MrrDocUploadComponent implements OnInit {

  isLoadingOne = false;
  breadcrumb = ''; // 標題欄顯示
  documentGroupTypeId = 0;
  routeType; // 記錄從路由過來的 類型
  routeProName; // 記錄從路由過來的 機種名稱
  objectKeys = Object.keys; // 方便遍歷 對象, 用於顯示
  querySelect; // 下拉框選項
  addUploadButtonFlag = false; // 上傳文件新增按鈕
  fileSetTipsFlag = false; // 文件設定的提示文字
  fileToUpload: File[] = [];
  tableFlag = false; // 表格顯示標誌
  dataSet = [];
  checkCache = {};
  viewDataSet = []; // 表格查询 数据
  downloadPath = DFILoopBackConfig.getPath().toString() + '/api/Containers/mrrDoc/download/';
  userRole = localStorage.getItem('$DFI$userRole');
  userId = localStorage.getItem('$DFI$userID');
  canReadIDbook = false;
  documents: ProductDocument[] = []; // 可以上傳的文件類型
  editByPass = false;
  showDatas = [];
  trans = {};
  constructor(
    private mrrDocSelectService: MrrDocSelectService,
    private mrrDocUploadService: MrrDocUploadService,
    private mrrDocViewService: MrrDocViewService,
    private fileService: FileService,
    private route: ActivatedRoute,
    private message: NzMessageService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    // 初始化i18n;
    this.translate.get(['mrr.mrr-site', 'mrr.mrr-plant', 'mrr.mrr-product', 'mrr.mrr-customer', 'mrr.document-fileName-duplicate-notice', 'mrr.check-file-item']).subscribe(res => {
      MrrDocUploadQuery.site.style.label = res['mrr.mrr-site'];
      MrrDocUploadQuery.plant.style.label = res['mrr.mrr-plant'];
      MrrDocUploadQuery.productType.style.label = res['mrr.mrr-product'];
      MrrDocUploadQuery.custom.style.label = res['mrr.mrr-customer'];
      this.trans['duplicate-notice'] = res['mrr.document-fileName-duplicate-notice'];
      this.trans['check-file-item'] = res['mrr.check-file-item'];
    });
    // 當點擊切換語言
    this.translate.onLangChange.pipe(takeUntil(new Subject())).subscribe(cur => {
      this.translate.get(['mrr.mrr-site', 'mrr.mrr-plant', 'mrr.mrr-product', 'mrr.mrr-customer', 'mrr.document-fileName-duplicate-notice', 'mrr.check-file-item']).subscribe(res => {
        MrrDocUploadQuery.site.style.label = res['mrr.mrr-site'];
        MrrDocUploadQuery.plant.style.label = res['mrr.mrr-plant'];
        MrrDocUploadQuery.productType.style.label = res['mrr.mrr-product'];
        MrrDocUploadQuery.custom.style.label = res['mrr.mrr-customer'];
        this.trans['duplicate-notice'] = res['mrr.document-fileName-duplicate-notice'];
        this.trans['check-file-item'] = res['mrr.check-file-item'];
      });
    });
    this.isLoadingOne = false;
    this.canReadIDbook = (this.userRole.toLocaleUpperCase() === 'SQM' || this.userRole.toLocaleUpperCase() === 'CMF' || this.userRole.toLocaleUpperCase() === 'SQM LEADER');
    this.route.queryParams.subscribe(params => {
      this.querySelect = { ...MrrDocUploadQuery };
      this.addUploadButtonFlag = false;
      this.tableFlag = false;
      this.routeType = params['docType'];
      this.querySelect.site.value = (!params['site'] ? '' : params['site']);
      this.querySelect.plant.value = (!params['plant'] ? '' : params['plant']);
      this.querySelect.productType.value = (!params['productType'] ? '' : params['productType']);
      this.querySelect.custom.value = (!params['custom'] ? '' : params['custom']);
      this.querySelect.proCode.value = (!params['proCode'] ? '' : params['proCode']);
      this.querySelect.proName.value = (!params['model'] ? '' : params['model']);
      this.routeProName = (!params['model'] ? '' : params['model']);
      switch (params['docType']) {
        case 'common': {
          this.breadcrumb = '通用標準文件';
          this.documentGroupTypeId = 3;
          delete this.querySelect['proCode'];
          delete this.querySelect['proName'];
          break;
        }
        case 'appearance': {
          this.breadcrumb = '外觀標準文件';
          this.documentGroupTypeId = 1;
          break;
        }
        case 'institutional': {
          this.breadcrumb = '機構標準文件';
          this.documentGroupTypeId = 2;
          break;
        }
      }
      this.initSelect();
      this.customerSelect(this.querySelect.plant.value, this.querySelect.productType.value, params['custom']); // 改變 客戶別 的值
      this.proNameSelect(this.querySelect.plant.value, this.querySelect.productType.value, this.querySelect.custom.value, params['model']); // 改變Plant的值
      this.proCodeSelect(this.querySelect.plant.value, this.querySelect.productType.value, this.querySelect.custom.value); // 改變 Project Code下拉框 的值
    });
  }

  initSelect() {
    this.initSiteSelect();
    this.initPlantSelect();
    this.initCustomerSelect();
    this.initProductTypeSelect();
    this.productTypeSelect();
    this.initProCodeSelect();
    this.initProNameSelect();
  }

  // site下拉框選擇
  initSiteSelect() {
    this.mrrDocSelectService.getSite().subscribe(data => this.querySelect.site.select.selectList = data);
    // 監聽下拉框的值改變
    const changeSiteList = (site?) => {
      return of(site);
    };
    const siteList$: Observable<string[]> = this.querySelect.site.change$.asObservable().pipe(debounceTime(500)).pipe(switchMap(changeSiteList));
    // 下拉框的值改變后，更改下一個下拉框中的值
    siteList$.subscribe(datas => {
      this.plantSelect(datas); // 改變Plant的值
      this.querySelect.plant.value = '';
      this.querySelect.productType.value = '';
      this.querySelect.custom.value = '';
      if (this.breadcrumb !== '通用標準文件') {
        this.querySelect.proCode.value = '';
        this.querySelect.proName.value = '';
      }
    });
  }

  // 廠別下拉框選擇
  initPlantSelect() {
    // 監聽下拉框的值改變
    const changePlantList = (plant?) => {
      return of(plant);
    };
    const plantList$: Observable<string[]> = this.querySelect.plant.change$.asObservable().pipe(debounceTime(500)).pipe(switchMap(changePlantList));
    // 下拉框的值改變后，更改下一個下拉框中的值
    plantList$.subscribe(datas => {
      this.productTypeSelect(datas);
      this.customerSelect(datas, this.querySelect.productType.value); // 改變 客戶別 的值
      this.querySelect.productType.value = '';
      this.querySelect.custom.value = '';
      if (this.breadcrumb !== '通用標準文件') {
        this.querySelect.proCode.value = '';
        this.querySelect.proName.value = '';
      }
    });
  }

  plantSelect(site?) {
    this.mrrDocSelectService.getPlant(site).subscribe(data => this.querySelect.plant.select.selectList = data);
  }

  // 產品別下拉框
  initProductTypeSelect() {
    // 監聽下拉框的值改變
    const changeProductTypeList = (productType?) => {
      return of(productType);
    };
    const productTypeList$: Observable<string[]> = this.querySelect.productType.change$.asObservable().pipe(debounceTime(500)).pipe(switchMap(changeProductTypeList));
    // 下拉框的值改變后，更改下一個下拉框中的值
    productTypeList$.subscribe(datas => {
      this.customerSelect(this.querySelect.plant.value, datas); // 改變  客戶別 的值
      this.querySelect.custom.value = '';
      if (this.breadcrumb !== '通用標準文件') {
        this.querySelect.proCode.value = '';
        this.querySelect.proName.value = '';
      }
    });
  }

  productTypeSelect(plant?) {
    this.mrrDocSelectService.getProductType('productDocument', plant).subscribe(data => this.querySelect.productType.select.selectList = data);
  }

  // 客戶別下拉框
  initCustomerSelect() {
    // 監聽下拉框的值改變
    const changeCustomerList = (custom?) => {
      return of(custom);
    };
    const changeCustomerList$: Observable<string[]> = this.querySelect.custom.change$.asObservable().pipe(debounceTime(500)).pipe(switchMap(changeCustomerList));
    // 下拉框的值改變后，更改下一個下拉框中的值
    changeCustomerList$.subscribe(datas => {
      this.proCodeSelect(this.querySelect.plant.value, this.querySelect.productType.value, datas); // 改變 Project Code下拉框 的值
      this.proNameSelect(this.querySelect.plant.value, this.querySelect.productType.value, datas); // 改變 機種下拉框 的值
      if (this.breadcrumb !== '通用標準文件') {
        this.querySelect.proCode.value = '';
        this.querySelect.proName.value = '';
      }
    });
    const searchCustomerList = (custom?) => {
      return of(custom);
    };
    const searchCustomerList$: Observable<string[]> = this.querySelect.custom.select.searchChange$.asObservable().pipe(debounceTime(500)).pipe(switchMap(searchCustomerList));
    // 下拉框的值改變后，更改下一個下拉框中的值
    searchCustomerList$.subscribe(datas => {
      this.customerSelect(this.querySelect.plant.value, this.querySelect.productType.value, datas); // 改變Plant的值
    });
  }

  customerSelect(plant?, productType?, customer?) {
    this.mrrDocSelectService.getCustomer('productDocument', plant, productType, customer).subscribe(data => this.querySelect.custom.select.selectList = data);
  }

  // Project Code下拉框
  initProCodeSelect() {
    // 如果為 通用標準文件 則不再監聽下拉框 值的改變
    if (this.breadcrumb !== '通用標準文件') {
      const changeProCodeList = (proCode?) => {
        return of(proCode);
      };
      const changeProCodeList$: Observable<string[]> = this.querySelect.proCode.change$.asObservable().pipe(debounceTime(500)).pipe(switchMap(changeProCodeList));
      // 下拉框的值改變后，更改下一個下拉框中的值
      changeProCodeList$.subscribe(datas => {
        if (datas) {
          this.querySelect.proName.value = '';
          this.mrrDocSelectService.getProName('productDocument', this.querySelect.plant.value, this.querySelect.productType.value, this.querySelect.custom.value, datas, this.querySelect.proName.value).subscribe(data => {
            this.querySelect.proName.select.selectList = data;
            if (this.querySelect.proName.select.selectList.length === 1) {
              this.querySelect.proName.value = this.querySelect.proName.select.selectList[0]['Value'];
            }
          });
        }
      });
      const searchProCodeList = (proCode?) => {
        return of(proCode);
      };
      const searchProCodeList$: Observable<string[]> = this.querySelect.proCode.select.searchChange$.asObservable().pipe(debounceTime(500)).pipe(switchMap(searchProCodeList));
      // 下拉框的值改變后，更改下一個下拉框中的值
      searchProCodeList$.subscribe(datas => {
        if (datas) {
          this.proCodeSelect(this.querySelect.plant.value, this.querySelect.productType.value, this.querySelect.custom.value, datas); // 改變Plant的值
        }
      });
    }
  }

  proCodeSelect(plant?, productType?, customer?, proCode?) {
    if (this.breadcrumb !== '通用標準文件') {
      this.mrrDocSelectService.getProCode('productDocument', plant, productType, customer, proCode).subscribe(data => {
        this.querySelect.proCode.select.selectList = data;
      });
    }
  }

  // 機種下拉框
  initProNameSelect() {
    // 如果為 通用標準文件 則不再監聽下拉框 值的改變
    if (this.breadcrumb !== '通用標準文件') {
      // 監聽下拉框的值改變
      const changeProNameList = (proName?) => {
        return of(proName);
      };
      const changeProNameList$: Observable<string[]> = this.querySelect.proName.change$.asObservable().pipe(debounceTime(500)).pipe(switchMap(changeProNameList));
      // 下拉框的值改變后，更改下一個下拉框中的值
      changeProNameList$.subscribe(datas => {
        if (datas) {
          this.querySelect.proCode.value = '';
          this.mrrDocSelectService.getProCode('productDocument', this.querySelect.plant.value, this.querySelect.productType.value, this.querySelect.custom.value, this.querySelect.proCode.value, datas).subscribe(data => {
            this.querySelect.proCode.select.selectList = data;
            if (this.querySelect.proCode.select.selectList.length === 1) {
              this.querySelect.proCode.value = this.querySelect.proCode.select.selectList[0]['Value'];
            }
          });
        }
      });
      const searchProNameList = (proName?) => {
        return of(proName);
      };
      const searchProNameList$: Observable<string[]> = this.querySelect.proName.select.searchChange$.asObservable().pipe(debounceTime(500)).pipe(switchMap(searchProNameList));
      // 下拉框的值改變后，更改下一個下拉框中的值
      searchProNameList$.subscribe(datas => {
        if (datas) {
          this.proNameSelect(this.querySelect.plant.value, this.querySelect.productType.value, this.querySelect.custom.value, this.querySelect.proCode.value, datas); // 改變Plant的值
        }
      });
    }
  }

  proNameSelect(plant?, productType?, customer?, proCode?, proName?) {
    // 如果為 通用標準文件 則不再監聽下拉框 值的改變
    if (this.breadcrumb !== '通用標準文件') {
      this.mrrDocSelectService.getProName('productDocument', plant, productType, customer, proCode, proName).subscribe(data => {
        this.querySelect.proName.select.selectList = data;
      });
    }
  }

  // 查詢
  query() {
    if (!this.querySelect.plant.value) {
      this.message.create('error', 'Please select plant！');
      return;
    }
    if (!this.querySelect.productType.value) {
      this.message.create('error', 'Please select product！');
      return;
    }
    if (!this.querySelect.custom.value) {
      this.message.create('error', 'Please select customer！');
      return;
    }
    if (this.breadcrumb !== '通用標準文件' && !this.querySelect.proName.value) {
      this.message.create('error', 'Please select projectName！');
      return;
    }
    this.dataSet = [];
    this.showDatas = [];
    this.viewDataSet = [];
    this.checkCache = {};
    this.mrrDocSelectService.getTypeDocument(this.querySelect.plant.value, this.querySelect.productType.value).toPromise().then(
      result => {
        this.documents = result.filter(x => !!x.document).filter(x => x.document.documentTypeId === this.documentGroupTypeId).filter(x => (x.PIC.includes(this.userId)) || x.PICLeader1.includes(this.userId) || x.PICLeader2.includes(this.userId));
        if (this.documents.length) {
          this.addUploadButtonFlag = true;
          this.fileSetTipsFlag = false;
        } else {
          this.fileSetTipsFlag = true;
          this.addUploadButtonFlag = false;
        }
        this.queryViewData();
      });
  }

  queryViewData() {
    const queryValue: any = {
      productType: this.querySelect.productType.value,
      custom: this.querySelect.custom.value
    };
    if (this.breadcrumb !== '通用標準文件') {
      queryValue['proName'] = this.querySelect.proName.value;
    }
    this.mrrDocViewService.queryDataSet('productDocument', this.querySelect.plant.value, this.querySelect, this.breadcrumb).subscribe(d => {
      this.dataSet = d;
      this.viewDataSet = d.filter(f => f.typeName === this.breadcrumb);
    });
  }

  // 點擊 “+” 上傳文件
  handleUploadFiles(input) {
    // console.log(input);
    for (let index = 0; index < input.files.length; index++) {
      const file: File = input.files.item(index);
      if (file) {
        const fileName = (new Date()).getTime() + '' + file.name;
        const fileBlobPart = [];
        fileBlobPart.push(file);
        const newFile: File = new File(fileBlobPart, fileName, { type: file.type, lastModified: file.lastModified });
        this.fileToUpload.push(newFile);
        this.showDatas = [...this.showDatas, {
          fileName: file.name,
          docName: []
        }];
      }
    }
    if (this.showDatas.length) {
      this.tableFlag = true;
    }
  }

  checkBox(value: string[], index): void {
    this.checkCache[index] = value;
  }

  // 從表格中移除 文件
  deleteFlie(index) {
    this.showDatas = this.showDatas.filter((v, i) => i !== index);
    this.fileToUpload = this.fileToUpload.filter((v, j) => j !== index)
    if (this.checkCache) {
      let checkCacheCopy = JSON.parse(JSON.stringify(this.checkCache)); // 深拷贝
      delete checkCacheCopy[index];
      this.checkCache = {};
      for (let i = 0; i < this.showDatas.length; i++) {
        this.checkCache[i] = checkCacheCopy[`${Object.keys(checkCacheCopy)[i]}`]
      }
    }
    if (!this.showDatas.length) {
      this.tableFlag = false;
    }
  }

  // 確認上傳文件
  async uploadFiles() {
    this.isLoadingOne = true;
    let flag = false
    for (const key in this.checkCache) {
      if (Object.prototype.hasOwnProperty.call(this.checkCache, key)) {
        if (this.checkCache[key] === undefined || !this.checkCache[key].length) {
          flag = true;
          break;
        }
      }
    }
    const fileLength = new Set(this.showDatas.map(item => item.fileName)).size
    if (fileLength < this.showDatas.length) {
      this.message.create('error', this.trans['duplicate-notice']);
      this.isLoadingOne = false;
      return;
    } else if (Object.keys(this.checkCache).length !== this.showDatas.length || flag) {
      this.message.create('error', this.trans['check-file-item']);
      this.isLoadingOne = false;
      return;
    } else {
      this.fileService.postMRRDocFile(this.fileToUpload, 'mrrDoc').subscribe(
        async data => {
          for (let i = 0; i < data['result'].files.fileKey.length; i++) {
            const file = data['result'].files.fileKey[i];
            for (let indexCheckCache = 0; indexCheckCache < this.checkCache[i].length; indexCheckCache++) {
              const documentId = this.checkCache[i][indexCheckCache];
              if (this.documentGroupTypeId === 3) {
                await this.mrrDocUploadService.SetModelDocument(this.querySelect.custom.value, documentId, file.name);
              } else {
                await this.mrrDocUploadService.SetModelDocument(this.querySelect.proName.value, documentId, file.name);
              }
            }
          }
          this.isLoadingOne = false;
          this.message.create('success', 'Upload completed！');
          this.queryViewData();
        }, error => {
          this.isLoadingOne = false;
        });
    }
  }

  alert() {
    alert('Permission denied！');
  }

  async Delete(modelDoc: NewModelDocument) {
    await this.mrrDocUploadService.deleteModelDocument(modelDoc.Id);
    this.message.create('success', 'Delete complete！');
    this.query();
  }

  // by Pass 部分
  byPassEdit() {
    this.editByPass = true;
  }

  byPassSave() {
    this.mrrDocViewService.byPassSave(this.viewDataSet).subscribe(d => {
      this.message.create('success', 'Saved successfully！');
      this.byPassCancel();
    }, error => {
      this.message.create('error', 'Save failed！');
      this.byPassCancel();
    });
  }

  byPassCancel() {
    this.editByPass = false;
  }
}
