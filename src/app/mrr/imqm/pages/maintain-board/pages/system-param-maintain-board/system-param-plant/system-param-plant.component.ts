import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { SystemParamPlantService } from './system-param-plant.service';
import { ToolkitService } from 'app/mrr/imqm/imqm-common/service';
import { NzMessageService, NzI18nService, zh_TW, en_US } from 'ng-zorro-antd';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-system-param-plant',
  templateUrl: './system-param-plant.component.html',
  styleUrls: ['./system-param-plant.component.scss']
})
export class SystemParamPlantComponent implements OnInit, OnDestroy {

  // 表格資料
  dataSet;
  dataSetBk;

  // 表格暫存
  editCache;
  // 備份表格
  // dataSetBK;
  actionEnabled = true;
  isAuthEdit = true; // 操作权限
  isAllAuth = false; // all 权限

  // 下拉選單選擇後儲存內容的參數
  curPlant;
  factoryGroup = [];
  curSite;
  siteGroup = [];

  // 控制Query按鈕的開關
  isDisable = false;
  isDisableSearch = false;
  queryButton = true;

  new_drMonthlyAverage;
  new_yrTarget;
  new_numberStopsMonthlyAverage;
  new_spcCalculationFrequency;
  new_automaticTraceability;
  new_cpkCriteria;
  new_fakeRawdataCount;
  new_sqmsWeb;
    // 当前登录者的site, plant, userId
  site = JSON.parse(localStorage.getItem('$IMQM$UserInfo'))['site'];
  plant = JSON.parse(localStorage.getItem('$IMQM$UserInfo'))['plant'];
  userId = JSON.parse(localStorage.getItem('$IMQM$UserInfo'))['number'];

  destroy$ = new Subject();
  trans: object = {};
  sitePlantDic = {};
  constructor(
    private service: SystemParamPlantService,
    private toolKits: ToolkitService,
    private messageService: NzMessageService,
    private translate: TranslateService,
    private nzI18nService: NzI18nService
    ) {
      this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(lang => {
        this.translate.get(['imq-mt-drbyMonth', 'imq-mt-yrTargetVendor', 'imq-mt-stoplineCount', 'imq-mt-spcCalc',
        'imq-mt-autoTraceNum', 'imq-mt-cpkCriterian', 'imq-mt-dataDuplicate', 'imq-mt-failModify', 'imq-mt-successModify',
        'imq-mt-newMailVendor', 'imq-mt-needInput', 'imq-mt-need012', 'imq-mt-faseData', 'imq-mt-needNumber', 'imq-mt-sqmsWeb']).subscribe(res => {
          this.trans['drByMonth'] = res['imq-mt-drbyMonth'];
          this.trans['yrTargetVendor'] = res['imq-mt-yrTargetVendor'];
          this.trans['stoplineCount'] = res['imq-mt-stoplineCount'];
          this.trans['spcCalc'] = res['imq-mt-spcCalc'];
          this.trans['autoTraceNum'] = res['imq-mt-autoTraceNum'];
          this.trans['cpkCriterian'] = res['imq-mt-cpkCriterian'];
          this.trans['dataDuplicate'] = res['imq-mt-dataDuplicate'];
          this.trans['failModify'] = res['imq-mt-failModify'];
          this.trans['successModify'] = res['imq-mt-successModify'];
          this.trans['newMailVendor'] = res['imq-mt-newMailVendor'];
          this.trans['needInput'] = res['imq-mt-needInput'];
          this.trans['need012'] = res['imq-mt-need012'];
          this.trans['faseData'] = res['imq-mt-faseData']; // 假数据甄别片数
          this.trans['sqmsWeb'] = res['imq-mt-sqmsWeb'];
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

  ngOnInit() {
    // debugger;
    this.translate.get(['imq-mt-drbyMonth', 'imq-mt-yrTargetVendor', 'imq-mt-stoplineCount', 'imq-mt-spcCalc',
    'imq-mt-autoTraceNum', 'imq-mt-cpkCriterian', 'imq-mt-dataDuplicate', 'imq-mt-failModify', 'imq-mt-successModify',
    'imq-mt-newMailVendor', 'imq-mt-needInput', 'imq-mt-need012', 'imq-mt-faseData', 'imq-mt-needNumber', 'imq-mt-sqmsWeb']).subscribe(res => {
      this.trans['drByMonth'] = res['imq-mt-drbyMonth'];
      this.trans['yrTargetVendor'] = res['imq-mt-yrTargetVendor'];
      this.trans['stoplineCount'] = res['imq-mt-stoplineCount'];
      this.trans['spcCalc'] = res['imq-mt-spcCalc'];
      this.trans['autoTraceNum'] = res['imq-mt-autoTraceNum'];
      this.trans['cpkCriterian'] = res['imq-mt-cpkCriterian'];
      this.trans['dataDuplicate'] = res['imq-mt-dataDuplicate'];
      this.trans['failModify'] = res['imq-mt-failModify'];
      this.trans['successModify'] = res['imq-mt-successModify'];
      this.trans['newMailVendor'] = res['imq-mt-newMailVendor'];
      this.trans['needInput'] = res['imq-mt-needInput'];
      this.trans['need012'] = res['imq-mt-need012'];
      this.trans['faseData'] = res['imq-mt-faseData']; // 假数据甄别片数
      this.trans['sqmsWeb'] = res['imq-mt-sqmsWeb'];
      this.trans['needNumber'] = res['imq-mt-needNumber'];

      console.log(this.factoryGroup);
      const roles = JSON.parse(localStorage.getItem('$IMQM$UserRole'))['7'];
      const allRole = JSON.parse(localStorage.getItem('$IMQM$UserRole'))['26'];
      console.log(roles);
      this.isAuthEdit = roles['edit'];
      this.isAllAuth = allRole['read'];
      // if (this.isAllAuth) {
      //   this.service.getSites().subscribe(datas => { this.siteGroup = datas; });
      // } else {
      //   this.siteGroup = [this.site];
      //   this.service.getFactorys({site: this.site}).subscribe(datas => { this.factoryGroup = datas; });
      //   console.log(this.factoryGroup);
      // }

      this.sitePlantDic = JSON.parse(localStorage.getItem('$IMQM$SitePlan'));
      this.siteGroup = Object.keys(this.sitePlantDic);
     });
  }

  async getOptions(type) {
    switch (type) {
      case 'site':
        // this.service.getFactorys({site: this.curSite}).subscribe(datas => { this.factoryGroup = datas; });
        this.factoryGroup = this.sitePlantDic[this.curSite];
        this.isDisableSearch = (this.isAllAuth ? this.curSite && this.curPlant : this.curPlant) ? true : false;
        this.queryButton = (this.isAllAuth ? this.curSite && this.curPlant : this.curPlant) ? false : true;
        break;
      case 'factory':
        this.isDisableSearch = (this.isAllAuth ? this.curSite && this.curPlant : this.curPlant) ? true : false;
        this.queryButton = (this.isAllAuth ? this.curSite && this.curPlant : this.curPlant) ? false : true;
        break;
      default:
        this.isDisableSearch = false;
        this.queryButton = true;
        break;
    }
  }

  // 校驗輸入的SPC值在0~12
  // onChange(spc, id) {
  //   // debugger;
  //   spc = Number(spc);
  //   if ((spc > 0 || spc === 0) && (spc < 12 || spc === 12)) {
  //     // this.editCache[id].edit = true;
  //   } else {
  //     this.messageService.create('info', '請填寫0~12之間的數值');
  //     // this.editCache[id].edit = false;
  //   }
  // }

  async query() {
    this.dataSet = []; // 清空暫存資料

    const tempDataSet = [
    ];
    const res1 = await this.service.getInfo({type: 'average', plant: this.curPlant, product: '*', model: '*', productName: '*', partNumber: '*'}).toPromise();
      // tempDataSet[tempDataSet.findIndex(item => item.id === '0')]['detail'] = res[0];
      // tempDataSet[tempDataSet.findIndex(item => item.id === '2')]['detail'] = res[0];
      tempDataSet.push({
        id: 1,
        name: this.trans['stoplineCount'],
        detail: res1[0]
      });
      tempDataSet.push({
        id: 2,
        name: this.trans['drByMonth'],
        detail: res1[0]
      });
    const res2 = await this.service.getInfo({type: 'frequencyAndValue', plant: this.curPlant, product: '*', model: '*', productName: '*', partNumber: '*'}).toPromise();
      // tempDataSet[tempDataSet.findIndex(item => item.id === '3')]['detail'] = res[0];
      // tempDataSet[tempDataSet.findIndex(item => item.id === '4')]['detail'] = res[0];
      tempDataSet.push({
        id: 3,
        name: this.trans['spcCalc'],
        detail: res2[0]
      });
      tempDataSet.push({
        id: 4,
        name: this.trans['autoTraceNum'],
        detail: res2[0]
      });
      tempDataSet.push({
        id: 6,
        name: this.trans['cpkCriterian'],
        detail: res2[0]
      });
    const res3 = await this.service.getInfo({type: 'yrTarget', plant: this.curPlant, product: '*', model: '*', productName: '*', partNumber: '*'}).toPromise();
      // tempDataSet[tempDataSet.findIndex(item => item.id === '1')]['detail'] = res[0];
      tempDataSet.push({
        id: 5,
        name: this.trans['yrTargetVendor'],
        detail: res3[0]
      });

      const res4 = await this.service.getInfo({type: 'fakeRawdata', plant: this.curPlant, product: '*', model: '*', productName: '*', partNumber: '*'}).toPromise();
      tempDataSet.push({
        id: 7,
        name: this.trans['faseData'],
        detail: res4[0]
      });

      const res5 = await this.service.getInfo({type: 'sqmsWeb', plant: this.curPlant, product: '*', model: '*', productName: '*', partNumber: '*'}).toPromise();
      tempDataSet.push({
        id: 8,
        name: this.trans['sqmsWeb'],
        detail: res5[0]
      });
    console.log(tempDataSet);

    this.dataSet = tempDataSet;
    if (this.dataSet) {
      this.updateEditCache();
    }
    console.log('dataSet === \n',this.dataSet);
  }

  updateEditCache() {
    this.editCache = {}; // 清空缓存数据
    this.dataSet.forEach(item => {
      if (!this.editCache[ item.id ]) {
        this.editCache[ item.id ] = {
          edit: false,
          data: item
        };
      }
    });
  }

  // 按下編輯事件
  startEdit(key: string) {
    this.editCache[ key ].edit = true;
    this.actionEnabled = false;
    this.new_automaticTraceability = undefined;
    this.new_drMonthlyAverage = undefined;
    this.new_numberStopsMonthlyAverage = undefined;
    this.new_spcCalculationFrequency = undefined;
    this.new_yrTarget = undefined;
    this.new_cpkCriteria = undefined;
    this.new_fakeRawdataCount = undefined;
    this.new_sqmsWeb = undefined
    this.dataSetBk = JSON.parse(JSON.stringify(this.dataSet));
  }

  // 按下儲存事件
  async saveEdit(key: string) {
    // debugger;
    const index = this.dataSet.findIndex(item => item.id === key);
    this.editCache[ key ].edit = false;
    // 保存至DB
    Object.assign(this.dataSet[ index ], this.editCache[ key ].data);
    if (this.editCache[ key ].data.detail) { // 在DB中已存在，不用新增
      if (key.toString() === '3') {
        const spc = Number(this.editCache[ key ].data.detail['spcCalculationFrequency']);
        if ((spc > 0) && (spc < 12 || spc === 12)) {
         } else {
          this.messageService.create('info', this.trans['need012']);
          Object.assign(this.dataSet[ index ], this.editCache[ key ].data);
          this.editCache[ key ].edit = true;
          return;
      }
      }
      if (key.toString() === '6') {
        const cpkCriteria = Number(this.editCache[ key ].data.detail['cpkCriteria']);
        if (isNaN(cpkCriteria)) {
          this.messageService.create('info', this.trans['needInput']);
          this.editCache[ key ].edit = true;
          return;
      }
    }

    if (key.toString() === '7') {
      const fakeRawdataCount = Number(this.editCache[ key ].data.detail['fakeRawdataCount']);
      if ( Math.round(fakeRawdataCount) !== fakeRawdataCount || fakeRawdataCount < 1) {
        this.messageService.create('info', this.trans['needNumber']);
        this.editCache[ key ].edit = true;
        Object.assign(this.dataSet[ index ], this.editCache[ key ].data);
        return;
      }
    }

      this.service.updateParameterSetting(this.editCache[ key ].data.detail).subscribe(res => {
        if (res) {
          this.dataSet[ index ].detail = this.editCache[ key ].data.detail;
          this.messageService.create('success', this.trans['successModify']);
          // 將修改記錄保持至log
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
            cpkCriteria: this.editCache[key].data.detail['cpkCriteria'],
            fakeRawdataCount: this.editCache[key].data.detail['fakeRawdataCount'],
            sqmsWeb: this.editCache[key].data.detail['sqmsWeb'],
            time: new Date().getTime(),
            userId: this.userId
          };
          this.service.addParamterLog(logItem);
          console.log(this.editCache[ key ]);
        } else {
          this.messageService.create('error', this.trans['failModify']);
        }
      });
    } else { // 需要新增到DB
      // debugger;
      let type;
      let drMonthlyAverage;
      let numberStopsMonthlyAverage;
      let spcCalculationFrequency;
      let automaticTraceability;
      let yrTarget;
      let cpkCriteria;
      let fakeRawdataCount;
      let sqmsWeb;
      // 產生uuid
      const uuid = this.toolKits.guid();
      console.log(uuid);
      if (key.toString() === '1' || key.toString() === '2') {
        type = 'average';
        drMonthlyAverage = this.new_drMonthlyAverage;
        numberStopsMonthlyAverage = this.new_numberStopsMonthlyAverage;
      }
      if (key.toString() === '3' || key.toString() === '4' || key.toString() === '6') {
        type = 'frequencyAndValue';
        spcCalculationFrequency = this.new_spcCalculationFrequency;
        automaticTraceability = this.new_automaticTraceability;
        cpkCriteria = this.new_cpkCriteria;
      }
      if (key.toString() === '5') {
        type = 'yrTarget';
        yrTarget = this.new_yrTarget;
      }
      if (key.toString() === '7') {
        type = 'fakeRawdata';
        fakeRawdataCount = this.new_fakeRawdataCount;
      }
      if (key.toString() === '8') {
        type = 'sqmsWeb';
        sqmsWeb = this.new_sqmsWeb;
      }
      // by plant获取site
      const newItem = {
        id: uuid,
        type: type,
        site: await this.service.getSiteByPlant(this.curPlant),
        plant: this.curPlant,
        product: '*',
        model: '*',
        productName: '*',
        partNumber: '*',
        text: undefined,
        drMonthlyAverage: drMonthlyAverage,
        numberStopsMonthlyAverage: numberStopsMonthlyAverage,
        yrTarget: yrTarget,
        spcCalculationFrequency: spcCalculationFrequency,
        automaticTraceability: automaticTraceability,
        cpkCriteria: cpkCriteria,
        fakeRawdataCount: fakeRawdataCount,
        sqmsWeb: sqmsWeb
      };
      const newLogItem = {
        parameterSettingId: uuid,
        type: type,
        site: await this.service.getSiteByPlant(this.curPlant),
        plant: this.curPlant,
        product: '*',
        model: '*',
        productName: '*',
        partNumber: '*',
        text: undefined,
        drMonthlyAverage: drMonthlyAverage,
        numberStopsMonthlyAverage: numberStopsMonthlyAverage,
        yrTarget: yrTarget,
        spcCalculationFrequency: spcCalculationFrequency,
        automaticTraceability: automaticTraceability,
        cpkCriteria: cpkCriteria,
        fakeRawdataCount: fakeRawdataCount,
        sqmsWeb: sqmsWeb,
        time: new Date().getTime(),
        userId: this.userId
      };
      console.log(newItem);
      if (key.toString() === '3') {
        const spc = Number(newItem['spcCalculationFrequency']);
        if ((spc > 0) && (spc < 12 || spc === 12)) {
         } else {
          this.messageService.create('info', this.trans['need012']);
          this.editCache[ key ].edit = true;
          Object.assign(this.dataSet[ index ], this.editCache[ key ].data);
          return;
      }
      }
      if (key.toString() === '6') {
        const newCpkCriteria = Number(newItem['cpkCriteria']);
        if (isNaN(newCpkCriteria)) {
          this.messageService.create('info', this.trans['needInput']);
          this.editCache[ key ].edit = true;
          Object.assign(this.dataSet[ index ], this.editCache[ key ].data);
          return;
        }
      }

      if (key.toString() === '7') {
        const fakeRawdataCount = Number(newItem['fakeRawdataCount']);
        if ( Math.round(fakeRawdataCount) !== fakeRawdataCount || fakeRawdataCount < 1) {
          this.messageService.create('info', this.trans['needNumber']);
          this.editCache[ key ].edit = true;
          Object.assign(this.dataSet[ index ], this.editCache[ key ].data);
          return;
        }
      }

      this.service.updateParameterSetting(newItem).subscribe(res => {
        if (res) {
          this.dataSet[ index ].detail = newItem;
          this.editCache[ key ].data.detail = newItem;
          this.messageService.create('success',  this.trans['successModify']);
          // 同時將記錄新增至log
          this.service.addParamterLog(newLogItem);
          console.log(this.editCache[ key ]);
        } else {
          this.messageService.create('error', this.trans['failModify']);
        }
      });
    }

    this.cancelEdit(key);
  }

  // 按下取消事件
  cancelEdit(key: string) {
    // debugger;
    // this.editCache[key] = JSON.parse(JSON.stringify(this.editCacheBK));
    this.dataSet = this.dataSetBk;
    this.editCache[ key ].edit = false;
    this.actionEnabled = true;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
 }
}
