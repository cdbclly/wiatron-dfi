import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MOHAdditionApi, OperationLogApi } from '@service/dfc_sdk/sdk';
import { Observable, of, Subject } from 'rxjs';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd';
import { FileService } from '@service/file.service';
import { DfcSelectNewService } from '../dfc-select-new.service';
import { DfcMohModelnameQuery } from './moh-modelname';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-moh-modelname',
  templateUrl: './moh-modelname.component.html',
  styleUrls: ['./moh-modelname.component.scss']
})
export class MohModelnameComponent implements OnInit {

  allChecked = false;
  disabledDeleteButton = true;
  checkedNumber = 0;
  displayData: Array<DFCMohModelnameTableData> = [];
  dataSet = []; // 表格数据暂存
  editCache = {}; // 是否为编辑状态, 暂存 false, true
  actionEnabled = true; // Action按钮是否可用 true 可用, false 不可用
  editrow = ''; // 记录编辑状态时的表格行序号, 方便失去焦点时做判断

  isDeleteVisible = false; // 刪除對話框是否出現
  isAfterDeleteVisible = false; // 刪除后對話框是否出現
  indeterminate = false;


  fileToUpload: File = null;
  uploadFileName = '';
  showLoading = false;

  @ViewChild('DFCMohModel') dfcMohModel: ElementRef;
  nzWidthConfig = ['60px', '100px', '100px', '100px', '100px', '200px', '200px', '200px', '80px', '100px', '100px', '120px', '150px',
    '100px', '120px', '120px', '130px', '120px', '150px', '120px', '120px',
    '120px', '130px', '100px', '100px', '100px', '80px'];
  totalLength = this.nzWidthConfig.reduce((p, t) => {
    return p + parseInt(t, 10);
  }, 0).toString() + 'px';
  nzScroll: {} = { x: this.totalLength };

  Auth = JSON.parse(localStorage.getItem('$DFI$UserAuth'))['MOHAddition']; // 页面上的用户权限
  PlantMapping = JSON.parse(localStorage.getItem('DFC_PlantMapping'));


  querySelect = { ...DfcMohModelnameQuery };
  objectKeys = Object.keys; // 方便遍歷 對象, 用於顯示
  // I18N
  destroy$ = new Subject();
  trans;
  constructor(
    private mohAdditionServer: MOHAdditionApi,
    private fileService: FileService,
    private message: NzMessageService,
    private operationLogServer: OperationLogApi,
    private dfcSelectService: DfcSelectNewService,
    private translate: TranslateService
  ) {
    this.translate.get(['dfc.dfc-site', 'dfc.dfc-customer', 'dfq.dfq-product', 'dfc.forecast.select-plant']).subscribe(res => {
      this.querySelect.plant.style.label = res['dfc.dfc-site'];
      this.querySelect.custom.style.label = res['dfc.dfc-customer'];
      this.querySelect.productType.style.label = res['dfq.dfq-product'];
      this.trans = res['dfc.forecast.select-plant'];
    });
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(cur => {
      this.translate.get(['dfc.dfc-site', 'dfc.dfc-customer', 'dfq.dfq-product', 'dfc.forecast.select-plant']).subscribe(res => {
        this.querySelect.plant.style.label = res['dfc.dfc-site'];
        this.querySelect.custom.style.label = res['dfc.dfc-customer'];
        this.querySelect.productType.style.label = res['dfq.dfq-product'];
        this.trans = res['dfc.forecast.select-plant'];
      });
    });
  }

  ngOnInit() {
    this.initPlantSelect();
    this.initBuSelect();
    this.initCustomerSelect();
    this.productTypeSelect();
    this.nzScroll = { x: this.totalLength, y: (this.dfcMohModel.nativeElement.offsetHeight - 130) + 'px' };
  }

  // 廠別下拉框選擇
  initPlantSelect() {
    this.dfcSelectService.getPlant().subscribe(data => this.querySelect.plant.select.selectList = data);
    // 对厂别自动带入本厂的标签
    this.querySelect.plant.value = localStorage.getItem('DFC_Plant');
    // 監聽下拉框的值改變
    const changePlantList = (plant?) => {
      return of(plant);
    };
    const changePlantList$: Observable<string> = this.querySelect.plant.change$.asObservable().pipe(debounceTime(500)).pipe(switchMap(changePlantList));
    // 下拉框的值改變后，更改下一個下拉框中的值
    changePlantList$.subscribe(datas => {
      if (!!datas) {
        this.buSelect(datas); // 改變 BU 的值
        this.customerSelect(datas);
      }
      this.querySelect.bu.value = '';
      this.querySelect.custom.value = '';
      this.querySelect.proName.value = '';
      this.querySelect.proCode.value = '';
      this.querySelect.model.value = '';
    });
  }

  // BU下拉框
  initBuSelect() {
    // 監聽下拉框的值改變
    const changeBuList = (bu?) => {
      return of(bu);
    };
    const changeBuList$: Observable<string> = this.querySelect.bu.change$.asObservable().pipe(debounceTime(500)).pipe(switchMap(changeBuList));
    // 下拉框的值改變后，更改下一個下拉框中的值
    changeBuList$.subscribe(datas => {
      this.customerSelect(this.querySelect.plant.value, datas);
      this.querySelect.proName.value = '';
      this.querySelect.proCode.value = '';
      this.querySelect.model.value = '';
    });

    // 搜索相關查詢
    const searchBuList = (bu?) => {
      return of(bu);
    };
    const searchBuList$: Observable<string[]> = this.querySelect.bu.select.searchChange$.asObservable().pipe(debounceTime(500)).pipe(switchMap(searchBuList));
    // 下拉框的值改變后，更改本下拉框中的值
    searchBuList$.subscribe(datas => {
      if (this.querySelect.plant.value) {
        this.buSelect(this.querySelect.plant.value, datas);
      }
    });
  }
  buSelect(plant?, bu?) {
    this.dfcSelectService.getBU(plant, bu).subscribe(data => this.querySelect.bu.select.selectList = data);
  }

  // 客戶別下拉框
  initCustomerSelect() {
    // 監聽下拉框的值改變
    const changeCustomerList = (custom?) => {
      return of(custom);
    };
    const changeCustomerList$: Observable<string> = this.querySelect.custom.change$.asObservable().pipe(debounceTime(500)).pipe(switchMap(changeCustomerList));
    // 下拉框的值改變后，更改下一個下拉框中的值
    changeCustomerList$.subscribe(datas => {
    });

    // 搜索相關查詢
    const searchCustomerList = (custom?) => {
      return of(custom);
    };
    const searchCustomerList$: Observable<string[]> = this.querySelect.custom.select.searchChange$.asObservable().pipe(debounceTime(500)).pipe(switchMap(searchCustomerList));
    // 下拉框的值改變后，更改下一個下拉框中的值
    searchCustomerList$.subscribe(datas => {
      if (this.querySelect.plant.value) {
        this.customerSelect(this.querySelect.plant.value, this.querySelect.productType.value, datas); // 改變Plant的值
      }
    });
  }
  customerSelect(plant?, bu?, customer?) {
    this.dfcSelectService.getCustom(plant, bu, customer).subscribe(data => this.querySelect.custom.select.selectList = data);
  }

  productTypeSelect() {
    this.dfcSelectService.getProductType().subscribe(data => this.querySelect.productType.select.selectList = data);
  }


  // 查询
  query() {
    if (!this.querySelect.plant.value) {
      this.message.create('error', this.trans);
      return;
    }
    this.dataSet = [];
    this.mohAdditionServer.GetList(
      this.querySelect.plant.value ? this.querySelect.plant.value : '',
      this.querySelect.bu.value ? this.querySelect.bu.value : '',
      this.querySelect.custom.value ? this.querySelect.custom.value : '',
      this.querySelect.productType.value ? this.querySelect.productType.value : '',
      this.querySelect.proCode.value ? this.querySelect.proCode.value : '',
      this.querySelect.proName.value ? this.querySelect.proName.value : '',
      this.querySelect.model.value ? this.querySelect.model.value : '',
      ''
    ).subscribe(
      mohDatas => {
        let index = 0;
        mohDatas.forEach(mohData => {
          index++;
          this.dataSet = [...this.dataSet, {
            Checked: false,
            No: index + '',
            Plant: this.querySelect.plant.value,
            BU: mohData['BU'],
            Customer: mohData['Customer'],
            ProductType: mohData['ProductType'],
            StageID: mohData['StageID'],
            Stage: mohData['Stage'],
            ProjectCode: mohData['ProjectCode'],
            ProjectName: mohData['ProjectName'],
            ModelName: mohData['ModelName'],
            ModelType: mohData['ModelType'],
            FixDepre: mohData['FixDepre'],
            FixAmort: mohData['FixAmort'],
            FixRent: mohData['FixRent'],
            SFixIdl: mohData['SFixIdl'],
            SFixSiteAlloc: mohData['SFixSiteAlloc'],
            SFixHQSup: mohData['SFixHQSup'],
            SFixPaCOut: mohData['SFixPaCOut'],
            SFixHpwr: mohData['SFixHpwr'],
            SFixRepair: mohData['SFixRepair'],
            VarDL: mohData['VarDL'],
            VarMpa: mohData['VarMpa'],
            VarMaterial: mohData['VarMaterial'],
            VarOther: mohData['VarOther'],
            VarDrive: mohData['VarDrive'],
            VarTravel: mohData['VarTravel'],
            VarTax: mohData['VarTax']
          }];
        });
        this.updateEditCache();
      });
  }

  // 将编辑状态 初始化
  updateEditCache() {
    this.editCache = {};
    this.dataSet.forEach(item => {
      if (!this.editCache[item.No]) {
        this.editCache[item.No] = {
          edit: false,
          data: { ...item }
        };
      }
    });
  }

  // nzCurrentPageDataChange -- 當前頁面展示的回調函數
  currentPageDataChange($event: Array<DFCMohModelnameTableData>) {
    this.displayData = $event;
  }

  // 頁數改變(nzPageSizeChange), 頁碼改變(nzPageIndexChange) 時用的回調函數, 刷新table信息
  refreshStatus() {
    const allChecked = this.displayData.every(value => value.Checked === true);
    const allUnChecked = this.displayData.every(value => !value.Checked);
    this.allChecked = allChecked;
    this.indeterminate = (!allChecked) && (!allUnChecked);
    this.disabledDeleteButton = !this.dataSet.some(value => value.Checked);
    this.checkedNumber = this.dataSet.filter(value => value.Checked).length;
  }

  // 全選事件
  checkAll(value: boolean) {
    this.displayData.forEach(data => data.Checked = value);
    this.refreshStatus();
  }

  // 表格编辑事件
  startEdit(key: string) {
    this.editCache[key].edit = true;
    this.actionEnabled = false;
    this.editrow = key;
  }

  saveEdit(key: string) {
    const updataID = this.editCache[key].data['StageID'];
    const updataData = {
      FixDepre: this.editCache[key].data['FixDepre'],
      FixAmort: this.editCache[key].data['FixAmort'],
      FixRent: this.editCache[key].data['FixRent'],
      SFixIdl: this.editCache[key].data['SFixIdl'],
      SFixSiteAlloc: this.editCache[key].data['SFixSiteAlloc'],
      SFixHQSup: this.editCache[key].data['SFixHQSup'],
      SFixPaCOut: this.editCache[key].data['SFixPaCOut'],
      SFixHpwr: this.editCache[key].data['SFixHpwr'],
      SFixRepair: this.editCache[key].data['SFixRepair'],
      VarMpa: this.editCache[key].data['VarMpa'],
      VarMaterial: this.editCache[key].data['VarMaterial'],
      VarOther: this.editCache[key].data['VarOther'],
      VarDrive: this.editCache[key].data['VarDrive'],
      VarTravel: this.editCache[key].data['VarTravel'],
      VarTax: this.editCache[key].data['VarTax'],
      VarDL: this.editCache[key].data['VarDL']
    };
    const logData = {
      FixDepre: this.dataSet[(parseInt(key, 10) - 1)]['FixDepre'],
      FixAmort: this.dataSet[(parseInt(key, 10) - 1)]['FixAmort'],
      FixRent: this.dataSet[(parseInt(key, 10) - 1)]['FixRent'],
      SFixIdl: this.dataSet[(parseInt(key, 10) - 1)]['SFixIdl'],
      SFixSiteAlloc: this.dataSet[(parseInt(key, 10) - 1)]['SFixSiteAlloc'],
      SFixHQSup: this.dataSet[(parseInt(key, 10) - 1)]['SFixHQSup'],
      SFixPaCOut: this.dataSet[(parseInt(key, 10) - 1)]['SFixPaCOut'],
      SFixHpwr: this.dataSet[(parseInt(key, 10) - 1)]['SFixHpwr'],
      SFixRepair: this.dataSet[(parseInt(key, 10) - 1)]['SFixRepair'],
      VarMpa: this.dataSet[(parseInt(key, 10) - 1)]['VarMpa'],
      VarMaterial: this.dataSet[(parseInt(key, 10) - 1)]['VarMaterial'],
      VarOther: this.dataSet[(parseInt(key, 10) - 1)]['VarOther'],
      VarDrive: this.dataSet[(parseInt(key, 10) - 1)]['VarDrive'],
      VarTravel: this.dataSet[(parseInt(key, 10) - 1)]['VarTravel'],
      VarTax: this.dataSet[(parseInt(key, 10) - 1)]['VarTax'],
      VarDL: this.dataSet[(parseInt(key, 10) - 1)]['VarDL']
    };

    this.mohAdditionServer.patchAttributes(updataID, updataData).subscribe(rs => {
      this.editCache[key].edit = false;
      this.actionEnabled = true;
      this.editrow = '';
      this.dataSet[(parseInt(key, 10) - 1)]['FixDepre'] = this.editCache[key].data['FixDepre'];
      this.dataSet[(parseInt(key, 10) - 1)]['FixAmort'] = this.editCache[key].data['FixAmort'];
      this.dataSet[(parseInt(key, 10) - 1)]['FixRent'] = this.editCache[key].data['FixRent'];
      this.dataSet[(parseInt(key, 10) - 1)]['SFixIdl'] = this.editCache[key].data['SFixIdl'];
      this.dataSet[(parseInt(key, 10) - 1)]['SFixSiteAlloc'] = this.editCache[key].data['SFixSiteAlloc'];
      this.dataSet[(parseInt(key, 10) - 1)]['SFixHQSup'] = this.editCache[key].data['SFixHQSup'];
      this.dataSet[(parseInt(key, 10) - 1)]['SFixPaCOut'] = this.editCache[key].data['SFixPaCOut'];
      this.dataSet[(parseInt(key, 10) - 1)]['SFixHpwr'] = this.editCache[key].data['SFixHpwr'];
      this.dataSet[(parseInt(key, 10) - 1)]['SFixRepair'] = this.editCache[key].data['SFixRepair'];
      this.dataSet[(parseInt(key, 10) - 1)]['VarMpa'] = this.editCache[key].data['VarMpa'];
      this.dataSet[(parseInt(key, 10) - 1)]['VarMaterial'] = this.editCache[key].data['VarMaterial'];
      this.dataSet[(parseInt(key, 10) - 1)]['VarOther'] = this.editCache[key].data['VarOther'];
      this.dataSet[(parseInt(key, 10) - 1)]['VarDrive'] = this.editCache[key].data['VarDrive'];
      this.dataSet[(parseInt(key, 10) - 1)]['VarTravel'] = this.editCache[key].data['VarTravel'];
      this.dataSet[(parseInt(key, 10) - 1)]['VarTax'] = this.editCache[key].data['VarTax'];
      this.dataSet[(parseInt(key, 10) - 1)]['VarDL'] = this.editCache[key].data['VarDL'];
    }, error => console.log(error));
    // 將操作信息存入緩存
    const logMsg = 'update\t廠別: ' + this.querySelect.plant.value + '\t' + localStorage.getItem('$DFI$userName') +
      '\nStageID: ' + this.editCache[key].data['StageID'] +
      '\n修改信息, 如下:' +
      '\nFixDepre: ' + logData.FixDepre + ' -> ' + updataData.FixDepre +
      '\nFixAmort: ' + logData.FixAmort + ' -> ' + updataData.FixAmort +
      '\nFixRent: ' + logData.FixRent + ' -> ' + updataData.FixRent +
      '\nSFixIdl: ' + logData.SFixIdl + ' -> ' + updataData.SFixIdl +
      '\nSFixSiteAlloc: ' + logData.SFixSiteAlloc + ' -> ' + updataData.SFixSiteAlloc +
      '\nSFixHQSup: ' + logData.SFixHQSup + ' -> ' + updataData.SFixHQSup +
      '\nSFixPaCOut: ' + logData.SFixPaCOut + ' -> ' + updataData.SFixPaCOut +
      '\nSFixHpwr: ' + logData.SFixHpwr + ' -> ' + updataData.SFixHpwr +
      '\nSFixRepair: ' + logData.SFixRepair + ' -> ' + updataData.SFixRepair +
      '\nVarMpa: ' + logData.VarMpa + ' -> ' + updataData.VarMpa +
      '\nVarMaterial: ' + logData.VarMaterial + ' -> ' + updataData.VarMaterial +
      '\nVarOther: ' + logData.VarOther + ' -> ' + updataData.VarOther +
      '\nVarDrive: ' + logData.VarDrive + ' -> ' + updataData.VarDrive +
      '\nVarTravel: ' + logData.VarTravel + ' -> ' + updataData.VarTravel +
      '\nVarTax: ' + logData.VarTax + ' -> ' + updataData.VarTax +
      '\nVarDL: ' + logData.VarDL + ' -> ' + updataData.VarDL;
    this.operationLogServer.create({
      userID: localStorage.getItem('$DFI$userID'),
      APname: 'MOH機種差异項維護',
      data: logMsg
    }).subscribe(rs => console.log(rs), error => console.log(error));
  }

  cancelEdit(key: string) {
    this.editCache[key].edit = false;
    this.actionEnabled = true;
    this.editrow = '';
  }

  handleUploadFile(input) {
    this.fileToUpload = input.files.item(0);
    if (this.fileToUpload) {
      const fileType = this.fileToUpload.type;
      let fileErrMsg = '';
      const validExts = new Array('.xlsx', '.xls', '.csv');
      let fileExt = this.fileToUpload.name;
      fileExt = fileExt.substring(fileExt.lastIndexOf('.'));
      if (validExts.indexOf(fileExt) < 0) {
        fileErrMsg = 'Invalid file type. Only Excel types are accepted.';
      }
      if (!!fileErrMsg) {
        this.message.create('error', fileErrMsg);
        this.fileToUpload = null;
        this.uploadFileName = '';
        return;
      }
      this.uploadFileName = this.fileToUpload.name;
    } else {
      this.uploadFileName = '';
    }
  }

  upload(file) {
    if (!this.querySelect.plant.value) {
      this.message.create('error', this.trans);
    } else {
      const now = new Date();
      this.showLoading = true;
      this.fileService.postDFCFile(file, 'mohAddition')
        .subscribe(data => {
          this.message.create('success', 'Upload successfully!');
          this.showLoading = false;
          this.query();
          // 將操作信息存入緩存
          const logMsg = 'upload\t廠別: ' + this.querySelect.plant.value + '\t' + localStorage.getItem('$DFI$userName') +
            '\n上傳文件信息, 如下:\n' + JSON.stringify(data);
          this.operationLogServer.create({
            userID: localStorage.getItem('$DFI$userID'),
            APname: 'MOH機種差异項維護',
            data: logMsg
          }).subscribe(rs => console.log(rs), error => console.log(error));
        }, error => {
          const err = 'Upload failed: ' + JSON.stringify(error.error.error.message);
          this.message.create('error', err);
          this.showLoading = false;
        });
    }
  }

  download() {
    if (!this.querySelect.plant.value) {
      this.message.create('error', this.trans);
    } else {
      this.fileService.downloadMOHAdditions(this.querySelect.plant.value, this.querySelect.proCode.value, this.querySelect.proName.value);
    }
  }
}

/**
 * 頁面表格資料 類
 */
export class DFCMohModelnameTableData {
  Checked: boolean; // 該列是否選中
  No: string; // 對應表格中的No
  Plant: string; // 廠別
  StageID: string; // StageID以此来识别
  ModelFamily: string; // 對應表格中的ModelFamily
  ModelName: string; // 對應表格中的ModelName
  FixDepre: string; // 折舊費用
  FixAmort: string; // Amortization
  FixRent: string; // 廠房折舊、租金
  SFixIdl: string; // IDL&臺派
  SFixSiteAlloc: string; // SiteAllocate
  SFixHQSup: string; // HQ Support
  SFixPaCOut: string; // PA Charge Out
  SFixHpwr: string; // 水電費用
  SFixRepair: string; // 保養&維護費用
  VarMpa: string; // 雜項購置費用
  VarMaterial: string; // 間接材料費用
  VarOther: string; // Other Expense
  VarDrive: string; // 交通費
  VarTravel: string; // 差旅費
  VarTax: string; // 稅費
  VarDL: string; // DL人事費用
}

/**
 * 新增頁面 form表單需要的資料格式
 */
export class DFCMohModelnameAddProject {
  SelectValue: string; // 下拉框中選中的值
  SelectList: { // 下拉框中的值
    Label: string,
    Value: string
  }[];
  InputValue: string; // 輸入框中的值
}
