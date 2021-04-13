import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToolkitService } from 'app/mrr/imqm/imqm-common/service';
import { ActivatedRoute } from '@angular/router';
import { SystemParamDetailService } from './system-param-detail.service';
import { NzMessageService, NzI18nService, en_US, zh_TW } from 'ng-zorro-antd';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { isArray } from 'util';

@Component({
  selector: 'app-system-param-detail',
  templateUrl: './system-param-detail.component.html',
  styleUrls: ['./system-param-detail.component.scss']
})
export class SystemParamDetailComponent implements OnInit, OnDestroy {

  // 表格資料
  dataSet: any[] = [];
  dataSetBk: any[] = [];

  // 表格暫存
  editCache;
  editCacheProductName;
  actionEnabled = true;

  // 下拉選單選項參數
  categoryGroup = [];
  factoryGroup = [];
  modelGroup = [];
  productGroup = [];
  materialGroup = [];
  prodTypeGroup = [];
  // 单个新增 厂别数据
  factoryGroupAdd = [];

  // 下拉選單選擇後儲存內容的參數
  curCategory;
  curFactory;
  curModel;
  curProduct;
  curMaterial;
  curProdType;

  // 下拉選單的是否可選開關
  isDisableFactory = true;
  isDisableModel = true;
  isDisableProduct = true;
  isDisableMaterial = true;
  isDisableProdType = true;
  isAuthEdit = false; // 操作权限
  isAuthCreate = false;
  isAuthDel = false;
  isAllAuth = false; // all 权限


  // 必填標示的顯示開關
  isShowFactoryMark = false;
  isShowModelMark = false;
  isShowProductMark = false;

  // 控制Query按鈕的開關
  isDisable = false;
  isDisableSearch = false;
  isDisableQueryButton = true;

  // Modal視窗顯示開關
  isModalVisible = false;

  // Modal視窗選擇後儲存內容的參數
  curModalCategory;

  // Modal視窗輸入的內容
  inputFactory;
  inputProdType;
  inputModel;
  inputProduct;
  inputMaterial;
  inputValue;

  // Modal視窗輸入框的開關
  isDisableModalFactory = true;
  isDisableModalProdType = true;
  isDisableModalModel = true;
  isDisableModalProduct = true;
  isDisableModalMaterial = true;
  isDisableModalValue = true;

  // Modal視窗輸入確認
  isModalPass = false;
  siteInfos;

  destroy$ = new Subject();
  trans: object = {};

  // 当前登录者的site, plant
  site = JSON.parse(localStorage.getItem('$IMQM$UserInfo'))['site'];
  plant = JSON.parse(localStorage.getItem('$IMQM$UserInfo'))['plant'];
  userId = JSON.parse(localStorage.getItem('$IMQM$UserInfo'))['number'];

  constructor(
    private route: ActivatedRoute,
    private service: SystemParamDetailService,
    private toolKits: ToolkitService,
    private messageService: NzMessageService,
    private translate: TranslateService,
    private nzI18nService: NzI18nService
    ) {
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(lang => {
      this.translate.get(['imq-mt-incompleteInfo', 'imq-mt-dataDuplicate', 'imq-mt-failAdd', 'imq-mt-successAdd',
      'imq-mt-needInput', 'imq-mt-failDel', 'imq-mt-successDel', 'imq-mt-failModify', 'imq-mt-successModify', 'imq-mt-need012',
      'imq-mt-needNumber']).subscribe(res => {
        this.trans['incompleteInfo'] = res['imq-mt-incompleteInfo'];
        this.trans['dataDuplicate'] = res['imq-mt-dataDuplicate'];
        this.trans['failAdd'] = res['imq-mt-failAdd'];
        this.trans['successAdd'] = res['imq-mt-successAdd'];
        this.trans['needInput'] = res['imq-mt-needInput'];
        this.trans['failDel'] = res['imq-mt-failDel'];
        this.trans['successDel'] = res['imq-mt-successDel'];
        this.trans['failModify'] = res['imq-mt-failModify'];
        this.trans['successModify'] = res['imq-mt-successModify'];
        this.trans['need012'] = res['imq-mt-need012'];
        this.trans['needNumber'] = res['imq-mt-needNumber'];
        if (lang.lang === 'en') {
          this.nzI18nService.setLocale(en_US);
        } else {
          this.nzI18nService.setLocale(zh_TW);
        }
        this.ngOnInit();
      });
    });
  }

  async ngOnInit() {
    this.translate.get(['imq-mt-incompleteInfo', 'imq-mt-dataDuplicate', 'imq-mt-failAdd', 'imq-mt-successAdd',
    'imq-mt-needInput', 'imq-mt-failDel', 'imq-mt-successDel', 'imq-mt-failModify', 'imq-mt-successModify', 'imq-mt-need012',
    'imq-mt-needNumber']).subscribe(async ress => {
      this.trans['incompleteInfo'] = ress['imq-mt-incompleteInfo'];
      this.trans['dataDuplicate'] = ress['imq-mt-dataDuplicate'];
      this.trans['failAdd'] = ress['imq-mt-failAdd'];
      this.trans['successAdd'] = ress['imq-mt-successAdd'];
      this.trans['needInput'] = ress['imq-mt-needInput'];
      this.trans['failDel'] = ress['imq-mt-failDel'];
      this.trans['successDel'] = ress['imq-mt-successDel'];
      this.trans['failModify'] = ress['imq-mt-failModify'];
      this.trans['successModify'] = ress['imq-mt-successModify'];
      this.trans['need012'] = ress['imq-mt-need012'];
      this.trans['needNumber'] = ress['imq-mt-needNumber'];
      // 以后这里要改
      const roles = JSON.parse(localStorage.getItem('$IMQM$UserRole'))['7'];
      const allRole = JSON.parse(localStorage.getItem('$IMQM$UserRole'))['26'];
      this.isAuthEdit = roles['edit'];
      this.isAuthCreate = roles['create'];
      this.isAuthDel = roles['delete'];
      this.isAllAuth = allRole['read'];
      if (this.isAllAuth) {
        await this.service.getSitePlantGroup().toPromise().then(res => {
          this.siteInfos = res;
        });
      }
      // if (this.isAllAuth) {
      //   await this.service.getFactorys().toPromise().then(datas => {
      //     this.factoryGroup = Array.from(new Set(datas.map(res => res['plant'] )));
      //     this.modelGroup = Array.from(new Set(datas.map(res => res['model'] )));
      //     this.productGroup = Array.from(new Set(datas.map(res => res['productName'] )));
      //     this.materialGroup =  Array.from(new Set(datas.map(res => res['partNumber'] )));
      //     this.prodTypeGroup =  Array.from(new Set(datas.map(res => res['product'] )));
      //   });
      //  await this.service.getSitePlantGroup().toPromise().then(res => {
      //     this.siteInfos = res;
      //   });
      //   console.log(this.siteInfos);
      // } else {
      //   this.service.getFactorys({site: this.site, plant: this.plant}).subscribe(datas => {
      //     this.factoryGroup = Array.from(new Set(datas.map(res => res['plant'])));
      //     this.modelGroup = Array.from(new Set(datas.map(res => res['model'])));
      //     this.productGroup = Array.from(new Set(datas.map(res => res['productName'] )));
      //     this.materialGroup =  Array.from(new Set(datas.map(res => res['partNumber'] )));
      //     this.prodTypeGroup =  Array.from(new Set(datas.map(res => res['product'] )));
      //   });
      // }
      // console.log(this.factoryGroup);
    });
  }

  getOptions(type, objGroup) {
    if (type === 'plant') {
      this.refreshTable();

      if (this.curCategory === 'pddr' || this.curCategory === 'hold') {
        this.isDisableFactory = false;
        this.isDisableModel = true;
        this.isDisableProduct = true;
        this.isDisableMaterial = true;
        this.isDisableProdType = true;
        this.isShowProductMark = false;
        this.isShowFactoryMark = true;
        this.isShowModelMark = false;
      } else if (this.curCategory === 'pdyr') {
        this.isDisableFactory = false;
        this.isDisableModel = false;
        this.isDisableProduct = false;
        this.isDisableMaterial = false;
        this.isDisableProdType = true;
        this.isShowFactoryMark = true;
        this.isShowModelMark = true;
      } else if (this.curCategory === 'spc' || this.curCategory === 'fakeRawdata' || this.curCategory === 'trace' || this.curCategory === 'cpk') {
        this.isDisableFactory = false;
        this.isDisableModel = false;
        this.isDisableProduct = true;
        this.isDisableMaterial = true;
        this.isDisableProdType = false;
        this.isShowProductMark = false;

        this.isShowFactoryMark = true;
        this.isShowModelMark = false;
      } else if (this.curCategory === 'deadline') {
        this.isDisableFactory = false;
        this.isDisableModel = false;
        this.isDisableProduct = false;
        this.isDisableMaterial = false;
        this.isDisableProdType = false;
        this.isShowFactoryMark = true;
        this.isShowProductMark = true;
        this.isShowModelMark = false;
      } else if (this.curCategory === 'shift') {
        this.isDisableFactory = false;
        this.isDisableModel = false;
        this.isDisableProduct = false;
        this.isShowModelMark = true;
        this.isDisableMaterial = false;
        this.isDisableProdType = false;
        this.isShowFactoryMark = true;
        this.isShowProductMark = true;
      }
      this.curFactory = undefined;
      this.curMaterial = undefined;
      this.curModel = undefined;
      this.curProdType = undefined;
      this.curProduct = undefined;
      this.factoryGroup.length = 0;
      this.prodTypeGroup.length = 0;
      this.productGroup.length = 0;
      this.modelGroup.length = 0;
      this.materialGroup.length = 0;
      console.log('Get Category Option Success!');
    }
    if ((this.curCategory === 'pddr' || this.curCategory === 'hold') && this.curFactory) {
      this.isDisableSearch = true;
      this.isDisableQueryButton = false;
    } else if (this.curCategory === 'pdyr' && this.curFactory && this.curModel) {
      this.isDisableSearch = true;
      this.isDisableQueryButton = false;
    } else if ((this.curCategory === 'spc' || this.curCategory === 'fakeRawdata' || this.curCategory === 'trace' || this.curCategory === 'cpk') && this.curFactory) {
      this.isDisableSearch = true;
      this.isDisableQueryButton = false;
    } else if (this.curCategory === 'deadline' && this.curFactory && this.curProdType) {
      this.isDisableSearch = true;
      this.isDisableQueryButton = false;
    } else if (this.curCategory === 'shift' && this.curFactory && this.curProdType && this.curModel) {
      this.isDisableSearch = true;
      this.isDisableQueryButton = false;
    } else {
      this.isDisableSearch = false;
      this.isDisableQueryButton = true;
    }

    switch (type) {
      case 'product':
        this.curProdType = undefined;
        this.curModel = undefined;
        this.curProduct = undefined;
        this.curMaterial = undefined;
        this.prodTypeGroup.length = 0;
        this.productGroup.length = 0;
        this.modelGroup.length = 0;
        this.materialGroup.length = 0;
        break;
      case 'model':
        this.curModel = undefined;
        this.curProduct = undefined;
        this.curMaterial = undefined;
        this.productGroup.length = 0;
        this.modelGroup.length = 0;
        this.materialGroup.length = 0;
        break;
      case 'productName':
        this.curProduct = undefined;
        this.curMaterial = undefined;
        this.productGroup.length = 0;
        this.materialGroup.length = 0;
        break;
      case 'partNumber':
        this.curMaterial = undefined;
        this.materialGroup.length = 0;
        break;
      default:
        break;
    }
    // map type
    // const curType = (this.curCategory === 'pddr' || this.curCategory === 'hold') ? 'average' : (this.curCategory === 'pdyr') ? 'yrTarget' : 'frequencyAndValue';
    let curType;
    if (this.curCategory === 'pddr' || this.curCategory === 'hold') {
      curType = 'average';
    } else if (this.curCategory === 'pdyr') {
      curType = 'yrTarget';
    } else if (this.curCategory === 'deadline') {
      curType = 'deadline';
    } else if (this.curCategory === 'shift') {
      curType = 'shift';
    } else {
      curType = 'frequencyAndValue';
    }
    const tt = objGroup instanceof Array;
    objGroup instanceof Array ? objGroup.length = 0 : objGroup = [];
    this.service.getParamsSelectData({type: curType, site: this.isAllAuth ? undefined : this.site, plant: (this.isAllAuth && !this.curFactory)  ? undefined : this.curFactory ? this.curFactory : this.plant,
    product: this.curProdType, model: this.curModel, productName: this.curProduct, partNumber: this.curMaterial}).subscribe(
      select => {
        select.forEach((item, index: number) => {
          objGroup[index] = item[type];
        });
        // 去除重复
        this.service.cleanArrDuplicate(objGroup);
      }
    );
  }

  query() {
    let i = 0;
    const tempDataSet = [];

    this.dataSet = []; // 清空暫存資料
    // plant: 厂别; product: 产品别;  品名: productName;
    this.service.getParameterSetting({plant: this.curFactory, productName: this.curProduct ? this.curProduct : undefined, model: this.curModel ? this.curModel : undefined, product: this.curProdType ? this.curProdType : undefined, partNumber: this.curMaterial ? this.curMaterial : undefined}).subscribe(res => {
      if ((this.curCategory === 'pddr' || this.curCategory === 'hold') && this.curFactory) {
        res['average'].forEach(element => {
          if (this.curCategory === 'pddr' && element['drMonthlyAverage']) {
            tempDataSet.push({
              key: String(i++),
              detail: element
            });
          }
          if (this.curCategory === 'hold' && element['numberStopsMonthlyAverage']) {
            tempDataSet.push({
              key: String(i++),
              detail: element
            });
          }
        });
      } else if (this.curCategory === 'pdyr' && this.curFactory && this.curModel) {
        res['yrTarget'].forEach(element => {
          if (this.curCategory === 'pdyr' && element['yrTarget']) {
            tempDataSet.push({
              key: String(i++),
              detail: element
            });
          }
        });
      } else if ((this.curCategory === 'spc' || this.curCategory === 'trace' || this.curCategory === 'cpk') && this.curFactory) {
        res['frequencyAndValue'].forEach(element => {
          if (this.curCategory === 'spc' && element['spcCalculationFrequency']) {
            tempDataSet.push({
              key: String(i++),
              detail: element
            });
          }
          if (this.curCategory === 'trace' && element['automaticTraceability']) {
            tempDataSet.push({
              key: String(i++),
              detail: element
            });
          }
          if (this.curCategory === 'cpk' && element['cpkCriteria']) {
            tempDataSet.push({
              key: String(i++),
              detail: element
            });
          }
        });
      } else if (this.curCategory === 'deadline' && this.curFactory && this.curProdType) {
        res['deadline'].forEach(element => {
          if (this.curCategory === 'deadline' && element['vendorReplyDeadline']) {
            tempDataSet.push({
              key: String(i++),
              detail: element
            });
          }
        });
      } else if (this.curCategory === 'shift' && this.curFactory && this.curProdType && this.curModel) {
        res['shift'].forEach(element => {
          if (this.curCategory === 'shift' && element['text']) {
            tempDataSet.push({
              key: String(i++),
              detail: element
            });
          }
        });
      } else if (this.curCategory === 'fakeRawdata' && this.curFactory) {
        res['fakeRawdata'].forEach(element => {
          if (this.curCategory === 'fakeRawdata' && element['fakeRawdataCount']) {
            tempDataSet.push({
              key: String(i++),
              detail: element
            });
          }
        });
      }
      this.dataSet = tempDataSet;
      if (this.dataSet) {
        this.updateEditCache();
      }
      console.log(this.dataSet);
    });

    // console.log('------------- \n');
    // console.log('actionEnabled = ', this.actionEnabled)
    // console.log('isAuthEdit = ', this.isAuthEdit)
  }

  updateEditCache() {
    this.editCache = {}; // 清空缓存数据
    this.dataSet.forEach(item => {
      if (!this.editCache[ item.key ]) {
        this.editCache[ item.key ] = {
          edit: false,
          data: item
        };
      }
    });
  }

  modalSelectGroup(objGroup: string[], name) {
    switch (name) {
      case 'model':
        this.inputModel = undefined;
        this.inputProduct = undefined;
        this.inputMaterial = undefined;
        this.modelGroup.length = 0;
        this.productGroup.length = 0;
        this.materialGroup.length = 0;
        break;
      case 'productName':
        this.inputProduct = undefined;
        this.inputMaterial = undefined;
        this.productGroup.length = 0;
        this.materialGroup.length = 0;
        break;
      case 'partNumber':
        this.inputMaterial = undefined;
        this.materialGroup.length = 0;
        break;
      default:
        break;
    }
    if (this.curModalCategory === 'pdyr') {
      objGroup instanceof Array ? objGroup.length = 0 : objGroup = [];
      this.service.getSelectDatas({plant: this.inputFactory, model: this.inputModel, productName: this.inputProduct, partNumber: this.inputMaterial}).subscribe(
        select => {
          select[name].map( (item, index: number) => {
            objGroup[index] = item;
          });
          this.checkModalInput();
        }
      );
    }
  }

  getkey(data) {
    return data.type + data.site + data.plant + data.product + data.model + data.productName + data.partNumber;
  }

  // 按下編輯事件
  startEdit(key: string) {
    // debugger;
    // console.log(key, this.dataSetBk);
    this.dataSetBk = JSON.parse(JSON.stringify(this.dataSet));
    // this.dataSet.map()
    this.editCache[ key ].edit = true;
    this.actionEnabled = false;
  }

  // 按下儲存事件
  async saveEdit(key: string, curCategory) {
    const index = this.dataSet.findIndex(item => item.key === key);
    this.editCache[ key ].edit = false;
    // 判斷spc數值範圍
    // debugger;
    if (this.editCache[ key ].data.detail['spcCalculationFrequency']) {
      const spc = Number(this.editCache[ key ].data.detail['spcCalculationFrequency']);
      if ((spc > 0 || spc === 0) && (spc < 12 || spc === 12)) {
       } else {
        this.messageService.create('info', this.trans['need012']);
        this.dataSet = JSON.parse(JSON.stringify(this.dataSetBk));
        Object.assign(this.editCache[ key ].data, this.dataSet[ index ]);
        // this.editCache[ key ].edit = true;
        this.cancelEdit(key);
        return;
    }
    }
    if (this.editCache[ key ].data.detail['cpkCriteria']) {
      const cpkCriteria = Number(this.editCache[ key ].data.detail['cpkCriteria']);
      if (isNaN(cpkCriteria)) {
        this.messageService.create('info', this.trans['needInput']);
        this.dataSet = JSON.parse(JSON.stringify(this.dataSetBk));
        Object.assign(this.editCache[ key ].data, this.dataSet[ index ]);
        this.cancelEdit(key);
        return;
    }
  }
  if (this.editCache[key].data.detail['fakeRawdataCount']) {
    const fakeRawdataCount = Number(this.editCache[ key ].data.detail['fakeRawdataCount']);
    if ( Math.round(fakeRawdataCount) !== fakeRawdataCount || fakeRawdataCount < 1) {
      this.messageService.create('info', this.trans['needNumber']);
      this.dataSet = JSON.parse(JSON.stringify(this.dataSetBk));
      Object.assign(this.editCache[ key ].data, this.dataSet[ index ]);
      this.cancelEdit(key);
      return;
    }
  }
    // 保存至DB
    // debugger;
    // console.log(this.dataSetBk[index]);
    // Object.assign(this.dataSet[ index ], this.editCache[ key ].data);
    // 先删除要修改的资料
    const num = await this.service.deleteParameterSetting(this.dataSetBk[index].detail['id']).toPromise();
    // console.log(num);
    // console.log(this.dataSet);
    // key欄位的空子串校驗
    this.editCache[ key ].data.detail['product'] = this.editCache[ key ].data.detail['product'] === '' ? '*' : this.editCache[ key ].data.detail['product'];
    this.editCache[ key ].data.detail['model'] = this.editCache[ key ].data.detail['model'] === '' ? '*' : this.editCache[ key ].data.detail['model'];
    this.editCache[ key ].data.detail['productName'] = this.editCache[ key ].data.detail['productName'] === '' ? '*' : this.editCache[ key ].data.detail['productName'];
    this.editCache[ key ].data.detail['partNumber'] = this.editCache[ key ].data.detail['partNumber'] === '' ? '*' : this.editCache[ key ].data.detail['partNumber'];
    this.service.updateParameterSetting(this.editCache[ key ].data.detail).subscribe(res => {
      if (res) {
        // this.dataSet[ index ] = this.editCache[ key ].data;
        this.dataSet[ index ].detail = this.editCache[ key ].data.detail;
        this.messageService.create('success', this.trans['successModify']);
        // 備份到log
        const logItem = {
          parameterSettingId: this.editCache[ key ].data.detail['id'],
          type: this.editCache[ key ].data.detail['type'],
          site: this.editCache[ key ].data.detail['site'],
          plant: this.editCache[ key ].data.detail['plant'],
          product: this.editCache[ key ].data.detail['product'],
          model: this.editCache[ key ].data.detail['model'],
          productName: this.editCache[ key ].data.detail['productName'],
          partNumber: this.editCache[ key ].data.detail['partNumber'],
          text: this.editCache[ key ].data.detail['text'],
          drMonthlyAverage: this.editCache[ key ].data.detail['drMonthlyAverage'],
          numberStopsMonthlyAverage: this.editCache[ key ].data.detail['numberStopsMonthlyAverage'],
          yrTarget: this.editCache[ key ].data.detail['yrTarget'],
          spcCalculationFrequency: this.editCache[ key ].data.detail['spcCalculationFrequency'],
          automaticTraceability: this.editCache[ key ].data.detail['automaticTraceability'],
          cpkCriteria: this.editCache[ key ].data.detail['cpkCriteria'],
          fakeRawdataCount: this.editCache[ key ].data.detail['fakeRawdataCount'],
          time: new Date().getTime(),
          userId: this.userId
        };
        this.service.addParamterLog(logItem);
        // console.log(this.editCache[ key ]);
      } else {
        this.messageService.create('error', this.trans['failModify']);
      }
    });

    this.cancelEdit(key);
  }

  // 按下取消事件
  cancelEdit(key: string) {
    this.editCache[ key ].edit = false;
    this.actionEnabled = true;
    this.dataSet = this.dataSetBk;
    // this.updateEditCache();
  }

  // 按下刪除事件
  deleteRow(key: string) {
    // let result;
    this.editCache[ key ].edit = false;
    // debugger;
    console.log(JSON.stringify(this.editCache[ key ].data.detail));
    // 保存至DB
    // result = this.service.deleteParameterSetting(this.editCache[ key ].data.detail);
    this.service.deleteParameterSetting(this.editCache[ key ].data.detail['id']).subscribe(result => {
      console.log(this.editCache[ key ].data.detail);
      if (result['result']) {
        // 將log中對應的信息也一起刪除
        this.service.deleteParamterLog(this.editCache[ key ].data.detail['id']);
        this.dataSet = this.dataSet.filter(item => item.key !== key);
        this.messageService.create('success', this.trans['successDel']);
      } else {
        this.messageService.create('error', this.trans['failDel']);
      }
    });
  }

  // 刷新TABLE內容
  refreshTable() {
    // 清空TABLE
    this.dataSet = [];

    // 將正在編輯的介面關閉
    if (this.dataSet) {
      this.dataSet.forEach(element => {
        this.cancelEdit(element.key);
      });
    }
  }

  // 按下新增按鈕後的事件
  showModal() {
    // this.curModalCategory = this.curCategory;
    this.getModalOptions();

    this.isModalVisible = true;
  }

  // Modal選擇類別的事件
  getModalOptions(plant?, factoryGroupAdd?) {
    if (plant) {
      this.addData(plant, factoryGroupAdd);
    }

    this.refreshModal();
    if (this.curModalCategory === 'pddr' || this.curModalCategory === 'hold') {
      this.isDisableModalFactory = false;
      this.isDisableModalProdType = true;
      this.isDisableModalModel = true;
      this.isDisableModalProduct = true;
      this.isDisableModalMaterial = true;
      this.isDisableModalValue = false;
    } else if (this.curModalCategory === 'pdyr') {
      this.isDisableModalFactory = false;
      this.isDisableModalProdType = true;
      this.isDisableModalModel = false;
      this.isDisableModalProduct = false;
      this.isDisableModalMaterial = false;
      this.isDisableModalValue = false;
    } else if (this.curModalCategory === 'spc' || this.curCategory === 'fakeRawdata' || this.curModalCategory === 'trace' || this.curModalCategory === 'cpk' || this.curModalCategory === 'fakeRawdata') {
      this.isDisableModalFactory = false;
      this.isDisableModalProdType = false;
      this.isDisableModalModel = false;
      this.isDisableModalProduct = true;
      this.isDisableModalMaterial = true;
      this.isDisableModalValue = false;
    } else if (this.curModalCategory === 'deadline') {
      this.isDisableModalFactory = false;
      this.isDisableModalProdType = false;
      this.isDisableModalModel = false;
      this.isDisableModalProduct = false;
      this.isDisableModalMaterial = false;
      this.isDisableModalValue = false;
    } else if (this.curModalCategory === 'shift') {
      this.isDisableModalFactory = false;
      this.isDisableModalProdType = false;
      this.isDisableModalModel = false;
      this.isDisableModalProduct = false;
      this.isDisableModalMaterial = false;
      this.isDisableModalValue = false;
    }
  }

  addData(type, factoryGroupAdd) {
    const tt = factoryGroupAdd instanceof Array;
    factoryGroupAdd instanceof Array ? factoryGroupAdd.length = 0 : factoryGroupAdd = [];
    this.service.getParamsSelectData({type: undefined, site: undefined, plant: undefined, product: undefined, model: undefined, productName: undefined, partNumber: undefined}).subscribe(
      select => {
        select.forEach((item, index: number) => {
          factoryGroupAdd[index] = item[type];
        });
        // 去除重复
        this.service.cleanArrDuplicate(factoryGroupAdd);
      }
    );
  }

  // 確認Modal輸入內容
  checkModalInput() {
    switch (this.curModalCategory) {
      case 'pddr':
        if (this.inputFactory && this.inputValue) {
          this.isModalPass = true;
        }
        break;

      case 'hold':
        if (this.inputFactory && this.inputValue) {
          this.isModalPass = true;
        }
        break;

      case 'pdyr':
        if (this.inputFactory && this.inputModel && this.inputValue) {
          this.isModalPass = true;
        }
        break;

      case 'spc':
        if (this.inputFactory && this.inputValue) {
          this.isModalPass = true;
        }
        break;

      case 'cpk':
        if (this.inputFactory && this.inputValue) {
          this.isModalPass = true;
        }
        break;

      case 'trace':
        if (this.inputFactory && this.inputValue) {
          this.isModalPass = true;
        }
        break;

      case 'deadline':
        if (this.inputFactory && this.inputProdType && this.inputValue) {
          this.isModalPass = true;
        }
        break;

      case 'shift':
        if (this.inputFactory && this.inputProdType && this.inputModel && this.inputValue) {
          this.isModalPass = true;
        }
        break;

        case 'fakeRawdata':
          if (this.inputFactory && this.inputValue) {
            this.isModalPass = true;
          }
          break;

      default:
        break;
    }
  }

  // Modal按下OK按鈕後的事件
  async handleModalOk() {
    let isDuplicated, type, drMonthlyAverage, numberStopsMonthlyAverage, yrTarget, spcCalculationFrequency, automaticTraceability, cpkCriteria, vendorReplyDeadline, text, fakeRawdataCount;
    console.log(this.inputFactory + ' ' + this.inputProdType + ' ' + this.inputModel + ' ' + this.inputProduct + ' ' + this.inputMaterial + ' ' + this.inputValue);

    switch (this.curModalCategory) {
      case 'pddr':
        type = 'average';
        drMonthlyAverage = this.inputValue;

        if (this.inputFactory && this.inputValue) {
          this.isModalPass = true;
        }
        break;

      case 'hold':
        type = 'average';
        numberStopsMonthlyAverage = this.inputValue;

        if (this.inputFactory && this.inputValue) {
          this.isModalPass = true;
        }
        break;

      case 'pdyr':
        type = 'yrTarget';
        yrTarget = parseFloat(this.inputValue);

        if (this.inputFactory && this.inputModel && this.inputValue) {
          this.isModalPass = true;
        }
        break;

      case 'spc':
        type = 'frequencyAndValue';
        spcCalculationFrequency = this.inputValue;
        // 判斷spc 數值大小
        const spc = Number(spcCalculationFrequency);
        if ((spc > 0 || spc === 0) && (spc < 12 || spc === 12)) {
        } else {
          this.messageService.create('info', this.trans['need012']);
          return;
        }

        if (this.inputFactory && this.inputValue) {
          this.isModalPass = true;
        }
        break;

      case 'cpk':
        type = 'frequencyAndValue';
        cpkCriteria = this.inputValue;
        if (isNaN(cpkCriteria)) {
          this.messageService.create('info', this.trans['needInput']);
          return;
        }
        if (this.inputFactory && this.inputValue) {
          this.isModalPass = true;
        }
        break;

      case 'trace':
        type = 'frequencyAndValue';
        automaticTraceability = this.inputValue;

        if (this.inputFactory && this.inputValue) {
          this.isModalPass = true;
        }
        break;

      case 'deadline':
        type = 'deadline';
        vendorReplyDeadline = this.inputValue;
        if (this.inputFactory && this.inputProdType && this.inputValue) {
          this.isModalPass = true;
        }
        break;

      case 'shift':
        type = 'shift';
        text = this.inputValue;
        if (this.inputFactory && this.inputProdType && this.inputValue && this.curModel) {
          this.isModalPass = true;
        }
        break;

        case 'fakeRawdata':
          type = 'fakeRawdata';
          fakeRawdataCount =  Number(this.inputValue);
          if ( Math.round(fakeRawdataCount) !== fakeRawdataCount || fakeRawdataCount < 1) {
            this.messageService.create('info', this.trans['needNumber']);
            return;
          }
          if (this.inputFactory && this.inputValue) {
            this.isModalPass = true;
          }
          break;

      default:
        break;
    }
    // 產生uuid
    // debugger
    const uuid = this.toolKits.guid();
    const content = {
      'id': uuid,
      'type': type,
      'site': this.isAllAuth ? this.siteInfos.filter(res => res.plant === this.inputFactory)[0]['site'] : this.site,
      'plant': this.inputFactory,
      'productName': this.inputProduct ? this.inputProduct : '*',
      'model': this.inputModel ? this.inputModel : '*',
      'product': this.inputProdType ? this.inputProdType : '*',
      'partNumber': this.inputMaterial ? this.inputMaterial : '*',
      'text': type === 'shift' ? this.inputValue : undefined,
      'drMonthlyAverage': drMonthlyAverage,
      'numberStopsMonthlyAverage': numberStopsMonthlyAverage,
      'yrTarget': yrTarget,
      'spcCalculationFrequency': spcCalculationFrequency,
      'automaticTraceability': automaticTraceability,
      'cpkCriteria': cpkCriteria,
      'vendorReplyDeadline': vendorReplyDeadline,
      'fakeRawdataCount': fakeRawdataCount
    };
    const checkContent = {
      'type': type,
      'site': this.isAllAuth ? this.siteInfos.filter(res => res.plant === this.inputFactory)[0]['site'] : this.site,
      'plant': this.inputFactory,
      'productName': this.inputProduct ? this.inputProduct : '*',
      'model': this.inputModel ? this.inputModel : '*',
      'product': this.inputProdType ? this.inputProdType : '*',
      'partNumber': this.inputMaterial ? this.inputMaterial : '*'
    };
    // 備份到log中的資料格式
    const logItem = {
      'parameterSettingId': uuid,
      'type': type,
      'site': this.isAllAuth ? this.siteInfos.filter(res => res.plant === this.inputFactory)[0]['site'] : this.site,
      'plant': this.inputFactory,
      'productName': this.inputProduct ? this.inputProduct : '*',
      'model': this.inputModel ? this.inputModel : '*',
      'product': this.inputProdType ? this.inputProdType : '*',
      'partNumber': this.inputMaterial ? this.inputMaterial : '*',
      'text': undefined,
      'drMonthlyAverage': drMonthlyAverage,
      'numberStopsMonthlyAverage': numberStopsMonthlyAverage,
      'yrTarget': yrTarget,
      'spcCalculationFrequency': spcCalculationFrequency,
      'automaticTraceability': automaticTraceability,
      'cpkCriteria': cpkCriteria,
      'fakeRawdataCount': fakeRawdataCount,
      'time': new Date().getTime(),
      'userId': this.userId
    };

    isDuplicated = await this.service.checkParameterSetting(checkContent);
    // debugger;
    if (this.isModalPass) {
      if (!isDuplicated) {
        this.service.addParameterSetting(content).subscribe(res => {
          if (res) {
            // this.dataSet = this.dataSet.concat(content);
            // this.updateEditCache();
            console.log(res);
            this.curCategory = this.curModalCategory;
            // this.curFactory = res['plant'];
            // this.curProdType = res['product'];
            // this.curModel = res['model'];
            // this.curProduct = res['productName'];
            // this.curMaterial = res['partNumber'];
            this.getOptions('plant', this.factoryGroup);
            const newItem = {
              detail: res,
              key: 1
            };
            // clean data
            if (this.curModalCategory === 'pdyr') {
                this.productGroup.length = 0;
                this.modelGroup.length = 0;
                this.materialGroup.length = 0;
                this.curModel = undefined;
                this.curProduct = undefined;
                this.curMaterial = undefined;
                this.curProdType = undefined;
                this.curFactory = undefined;
            }
            // debugger;
            this.dataSet = [];
            this.dataSet.push(newItem);
            console.log(this.dataSet);
            if (this.dataSet) {
              this.updateEditCache();
              this.messageService.create('success', this.trans['successAdd']);
              // 備份到log
              this.service.addParamterLog(logItem);
            }
          } else {
            this.messageService.create('error', this.trans['failAdd']);
          }
        });
      } else {
        this.messageService.create('error', this.trans['dataDuplicate']);
      }
    } else {
      this.messageService.create('error', this.trans['incompleteInfo']);
    }
    this.refreshModal();
    this.isModalVisible = false;
  }

  // Modal按下Cancel按鈕後的事件
  handleModalCancel(): void {
    this.refreshModal();
    this.isModalVisible = false;
     // clean data  因为 yrTarget 需要单独做下拉框处理，这里的数组是共用上面的菜单下拉框
     if (this.curModalCategory === 'pdyr') {
      //  debugger
      this.productGroup.length = 0;
      this.modelGroup.length = 0;
      this.materialGroup.length = 0;
      this.curModel = undefined;
      this.curProduct = undefined;
      this.curMaterial = undefined;
      this.curProdType = undefined;
      this.curFactory = undefined;
     }
  }

  refreshModal() {
    // 清空輸入框內容
    this.inputFactory = undefined;
    this.inputProdType = undefined;
    this.inputModel = undefined;
    this.inputProduct = undefined;
    this.inputMaterial = undefined;
    this.inputValue = undefined;

    // 關閉輸入框
    this.isDisableModalFactory = true;
    this.isDisableModalProdType = true;
    this.isDisableModalModel = true;
    this.isDisableModalProduct = true;
    this.isDisableModalMaterial = true;
    this.isDisableModalValue = true;

    this.isModalPass = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
 }
}
