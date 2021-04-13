import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { ClsDfcQueryStyle, ClsDfcQuerySelect, DfcSignHitoryParam } from 'app/shared/dfc-common';
import { ClsDfcMilitaryOrderQuery, DfcMilitaryOrderSignStartStyle, DfcMilitaryOrderSignStartValue, DfcMilitaryOrderSignStartSelect, DfcMilitaryOrderSignBuPlantSelect } from '../military-order-sign';
import { MilitaryOrderSignService } from '../military-order-sign.service';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd';
import { FileService } from '@service/file.service';
import { DfcCommonService } from 'app/shared/dfc-common/service/dfc-common.service';
import { DfcSelectNewService } from 'app/dfc/dfc-select-new.service';
// DFC SDK
import { LoopBackConfig as DFCLoopBackConfig } from '@service/dfc_sdk/sdk';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-military-order-sign-approve',
  templateUrl: './military-order-sign-approve.component.html',
  styleUrls: ['./military-order-sign-approve.component.scss']
})
export class MilitaryOrderSignApproveComponent implements OnInit, OnChanges {
  @Input() queryValue: ClsDfcMilitaryOrderQuery;
  @Input() tabelHeight: string;
  @Input() queryLoading;
  @Output() queryLoadingChange = new EventEmitter();
  private static SIGN_PLANT_ROLE = ['IE', 'PE', 'PME', 'PSE', 'PQM', 'DFI_LEADER', 'PLANT_MANAGER'];
  private static SIGN_BU_ROLE = ['EE', 'ME', 'SW', 'GSQM', 'PM', 'PM_HEAD', 'BU_HEAD'];
  dfcSignHitoryParam = new DfcSignHitoryParam();
  signData: {
    signID: any,
    formNo: any,
    signCode: any
  };
  // 上傳時需要用的參數
  showLoading = false;
  uploadType = 'png';
  // Opinion
  opinion: {
    style: ClsDfcQueryStyle,
    value: string
  } = {
      style: {
        type: 'input',
        style: { width: '100%' },
        red: false,
        label: 'Opinion',
      },
      value: ''
    };
  // 頁面上涉及的參數
  flag = false;
  editFlag = false;
  txt;
  table = {
    imgSrc: '', // 圖片路徑
    pic: '', // 圖片
    customer: '',
    modelType: '',
    fcst: '',
    proCode: '',
    proCodeID: '',
    proName: '',
    proNameID: '',
    plantCapacity: '', // plant規模量
    size: '', // 機種尺寸
    c3: '', // C3時間
    c4: '', // C4時間
    c5: '', // C5時間
    mp: '', // MP時間
    modelList: [],
  };
  editCache = {
    edit: false,
    data: {}
  }; // 編輯緩存
  militaryFlag = false;
  militaryStatus = 3;
  militaryNo;
  militaryCode;
  // stageID;
  signID;
  proCodeID;
  isMohFAYield = false;
  // 啟動簽核時 彈框中設置
  signStartUp = {
    popVisible: false,
    select: {
      style: DfcMilitaryOrderSignStartStyle,
      value: DfcMilitaryOrderSignStartValue,
      list: DfcMilitaryOrderSignStartSelect
    },
    buPlantSelect: DfcMilitaryOrderSignBuPlantSelect,
    describe: '',
    bu: '',
    bg: '',
    plant: '',
    plantName: '',
    buWorkflowMapID: '',
    plantWorkflowMapID: '',
    proNameID: '',
  };
  // 表格中的數據
  dataSet = [];
  nzScroll;
  // 邀簽
  addSignParam: {
    popVisible: boolean,
    select: {
      style: ClsDfcQueryStyle,
      value: string,
      list: ClsDfcQuerySelect
    }
  } = {
      popVisible: false,
      select: {
        style: {
          type: 'select',
          style: { width: '100%' },
          red: false,
          label: 'Member',
          selectType: 'search'
        },
        value: '',
        list: {
          selectList: [],
          searchChange$: new BehaviorSubject('')
        }
      }
    };
  // 下載時所需要的參數
  isPrintVisible = false;
  printValue: {
    proNameID: any,
    formNo: any,
    signIDs: any
  };
  PlantMapping = JSON.parse(localStorage.getItem('DFC_PlantMapping'));
  DFiLeaderFlag = false;
  Auth = JSON.parse(localStorage.getItem('$DFI$UserAuth'))['MilitaryOrderSign']; // 页面上的用户权限
  transParam = {};
  constructor(
    private militaryOrderSignService: MilitaryOrderSignService,
    private message: NzMessageService,
    private fileService: FileService,
    private dfcCommonService: DfcCommonService,
    private dfcSelectService: DfcSelectNewService,
    private translate: TranslateService
  ) {
    this.militaryOrderSignService.querySignObservable().subscribe(data => {
      this.flag = data['flag'];
      this.editFlag = data['editFlag'];
      this.txt = data['txt'];
      this.table = data['table'];
      this.editCache.edit = false;
      this.editCache.data = { ...data['table'] };
      this.militaryStatus = data['militaryStatus'];
      this.militaryFlag = data['militaryFlag'];
      this.signID = !data['signID2'] ? data['signID'] : [data['signID'], data['signID2']];
      this.militaryNo = data['militaryNo'];
      this.militaryCode = data['militaryCode'];
      this.dfcSignHitoryParam.btnAddSignFlag = true;
      this.dfcSignHitoryParam.btnBeforeAddSignFlag = true;
      this.dfcSignHitoryParam.btnAfterAddSignFlag = true;
      this.dfcSignHitoryParam.btnDownloadFlag = true;
      this.dfcSignHitoryParam.btnRejectFlag = false;
      this.signStartUp.bu = data['bu'];
      this.signStartUp.bg = data['bg'];
      this.signStartUp.plant = data['plant'];
      const plantMap = this.PlantMapping.find(plant => plant['Plant'] === data['plant']);
      this.signStartUp.plantName = plantMap['PlantName'].split('-')[0];
      this.signStartUp.proNameID = data['table']['proNameID'];
      this.proCodeID = data['proCodeID'];
      this.isMohFAYield = data['isMohFAYield'];
      this.signData = {
        signID: this.signID,
        formNo: this.militaryNo,
        signCode: this.militaryCode
      };
      this.signStartUp.select.list = { ...DfcMilitaryOrderSignStartSelect };
      this.signStartUp.select.style = { ...DfcMilitaryOrderSignStartStyle };
      this.signStartUp.select.value = { ...DfcMilitaryOrderSignStartValue };
      if (this.signStartUp.bg !== 'CSBG') {
        delete this.signStartUp.select.list.BU_HEAD;
        delete this.signStartUp.select.style.BU_HEAD;
        delete this.signStartUp.select.value.BU_HEAD;
      }
      this.initSignBuPlant();
      this.initSignSelect();
    });
  }

  ngOnInit() {
    // 初始化i18n;
    this.translate.get(['military-order.not-param-notice']).subscribe(res => {
      this.transParam['txt'] = res['military-order.not-param-notice'];
    });
    // 當點擊切換語言
    this.translate.onLangChange.pipe(takeUntil(new Subject())).subscribe(cur => {
      this.translate.get(['military-order.not-param-notice']).subscribe(res => {
        this.transParam['txt'] = res['military-order.not-param-notice'];
      });
    });
    this.DFILeader();
    this.nzScroll = { y: this.tabelHeight };
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['queryValue'] && changes['queryValue'].currentValue) {
      this.signStartUp.proNameID = this.queryValue.proName;
    }
  }

  // 判斷是否是 DFI Leader權限
  DFILeader() {
    this.dfcCommonService.DFILeader().subscribe(data => {
      this.DFiLeaderFlag = data['DFILeader'] || data['IsPlantLevel'];
    });
  }

  // 開啟編輯
  edit() {
    this.editCache.edit = true;
  }

  // 保存編輯
  save() {
    this.militaryOrderSignService.signSave(this.editCache.data, this.queryValue, this.militaryNo, this.transParam['txt']).then(data => {
      if (data['flag']) {
        this.militaryNo = data['militaryID'];
        this.editCache.data['size'] = data['size'];
        this.editCache.data['plantCapacity'] = data['plantCapacity'];
        this.editCache.data['pic'] = data['pic'];
        this.editCache.data['modelList'].map(modelList => {
          modelList['parts'] = data[modelList['type'] + '-' + modelList['modelId']]['parts'];
          modelList['quote'] = data[modelList['type'] + '-' + modelList['modelId']]['quoat'];
          modelList['mohGap'] = parseFloat(modelList['mohTarget'].toString()) - (!!modelList['quote'] ? modelList['quote'] : 0);
          return modelList;
        });
        this.table = JSON.parse(JSON.stringify(this.editCache.data));
        this.txt = data['txt'];
        this.militaryFlag = data['militaryFlag'];
        this.message.create('success', 'Saved successfully！');
      } else {
        for (let index = 0; index < data['res'].length; index++) {
          const res = data['res'][index];
          if (res['res'] === 'fail') {
            this.message.create('error', 'Save failed！' + res['data']);
            break;
          }
        }
      }
      this.cancel();
    });
  }

  // 取消編輯
  cancel() {
    this.editCache.edit = false;
  }

  FAYied(flag: boolean) {
    this.militaryOrderSignService.FAYied(this.militaryNo, flag).then(d => {
      console.log(d);
      this.startUpPop();
    });
  }

  // 啟動簽核 彈框 告知選擇的人員
  startUpPop() {
    this.signStartUp.popVisible = true;
  }
  cancelStart() {
    this.signStartUp.popVisible = false;
  }

  // 啟動
  startUp() {
    if (!this.militaryNo) {
      this.message.create('error', 'No editing！');
      return;
    }
    const roleList = ['IE', 'PE', 'PME', 'PQM', 'DFI_LEADER', 'PLANT_MANAGER', 'EE', 'ME', 'PM', 'PM_HEAD'];
    for (let index = 0; index < roleList.length; index++) {
      const role = roleList[index];
      if (!this.signStartUp.select.value[role]) {
        this.message.create('error', 'No choice ' + role + '！');
        return;
      }
    }
    if (this.signStartUp.bg === 'CSBG' && !this.signStartUp.select.value['BU_HEAD']) {
      this.message.create('error', 'No choice BU_HEAD！');
      return;
    }
    const plantMemberList = [];
    MilitaryOrderSignApproveComponent.SIGN_PLANT_ROLE.forEach(role => {
      if (!!this.signStartUp.select.value[role]) {
        plantMemberList.push({ empID: this.signStartUp.select.value[role], role: role });
      }
    });
    const buMemberList = [];
    MilitaryOrderSignApproveComponent.SIGN_BU_ROLE.forEach(role => {
      if (!!this.signStartUp.select.value[role]) {
        buMemberList.push({ empID: this.signStartUp.select.value[role], role: role });
      }
    });
    this.militaryOrderSignService.startUp(this.militaryNo, this.signStartUp.describe, plantMemberList, buMemberList,
      this.signStartUp.plantWorkflowMapID, this.signStartUp.buWorkflowMapID, this.signStartUp.proNameID).then(data => {
        if (data['res'] === 'success') {
          this.message.create('success', 'Start and sign off successfully！');
          this.queryValue.proName = this.signStartUp.proNameID;
          this.militaryOrderSignService.querySign(this.queryValue).then(queryData => {
            this.militaryOrderSignService.querySignPush(queryData);
            this.flag = true;
            this.cancelStart();
          });
        } else {
          this.message.create('error', 'Start sign-off failed！');
        }
      });
  }

  // 上傳 图片
  upload(file) {
    this.fileService.postPicture(file, 'picture').subscribe(upload => {
      const apiURL = DFCLoopBackConfig.getPath().toString();
      this.editCache.data['pic'] = upload['result']['files']['file'][0]['name'];
      this.editCache.data['imgSrc'] = apiURL + '/api/uploads/picture/download/' + upload['result']['files']['file'][0]['name'];
      this.save();
    }, error => console.log(error));
  }
  // 下載
  download() {
    this.isPrintVisible = true;
    this.printValue = {
      proNameID: this.table['proNameID'],
      formNo: this.militaryNo,
      signIDs: this.signID
    };
  }
  cancelPrint() {
    this.isPrintVisible = false;
  }

  // 加載軍令狀BU與Plant默認表單選項
  initSignBuPlant() {
    // 監聽 bu 下拉框的值改變
    const changePlantList = (plant?) => {
      return of(plant);
    };
    const changePlantList$: Observable<string> = this.signStartUp.buPlantSelect.plant.change$.asObservable().pipe(debounceTime(500)).pipe(switchMap(changePlantList));
    // 下拉框的值改變后，更改下一個下拉框中的值
    changePlantList$.subscribe(datas => {
      // 清空之前的下拉框
      MilitaryOrderSignApproveComponent.SIGN_PLANT_ROLE.forEach(role => {
        if (!!this.signStartUp.select.value[role]) {
          this.signStartUp.select.value[role] = '';
        }
      });
      // 查詢出新的值
      this.signPlantMember(datas);
    });
    // 搜索 plant 相關查詢
    const searchPlantList = (plant?) => {
      return of(plant);
    };
    const searchPlantList$: Observable<string[]> = this.signStartUp.buPlantSelect.plant.select.searchChange$.asObservable().pipe(debounceTime(500)).pipe(switchMap(searchPlantList));
    // 下拉框的值改變后，更改本下拉框中的值
    searchPlantList$.subscribe(datas => {
      if (this.signStartUp.buPlantSelect.plant.value) {
        this.plantSelect(datas);
      }
    });
    // 監聽 bu 下拉框的值改變
    const changeBuList = (bu?) => {
      return of(bu);
    };
    const changeBuList$: Observable<string> = this.signStartUp.buPlantSelect.bu.change$.asObservable().pipe(debounceTime(500)).pipe(switchMap(changeBuList));
    // 下拉框的值改變后，更改下一個下拉框中的值
    changeBuList$.subscribe(datas => {
      // 清空之前的下拉框
      MilitaryOrderSignApproveComponent.SIGN_BU_ROLE.forEach(role => {
        if (!!this.signStartUp.select.value[role]) {
          this.signStartUp.select.value[role] = '';
        }
      });
      // 查詢出新的值
      this.signBuMember(datas);
    });
    // 搜索 bu 相關查詢
    const searchBuList = (bu?) => {
      return of(bu);
    };
    const searchBuList$: Observable<string[]> = this.signStartUp.buPlantSelect.bu.select.searchChange$.asObservable().pipe(debounceTime(500)).pipe(switchMap(searchBuList));
    // 下拉框的值改變后，更改本下拉框中的值
    searchBuList$.subscribe(datas => {
      if (this.signStartUp.buPlantSelect.plant.value) {
        this.buSelect(this.signStartUp.plant, datas);
      }
    });
    // 賦初值
    this.signStartUp.buPlantSelect.bu.value = this.signStartUp.bu;
    this.signStartUp.buPlantSelect.plant.value = this.signStartUp.plant;
  }

  plantSelect(plant?) {
    this.militaryOrderSignService.sendPlantSelect(plant).subscribe(data => {
      this.signStartUp.buPlantSelect.plant.select.selectList = data;
    });
  }

  buSelect(plant?, bu?) {
    this.dfcSelectService.getBU(plant, bu).subscribe(data => this.signStartUp.buPlantSelect.bu.select.selectList = data);
  }

  // 啟動簽核下拉框設定
  async initSignSelect() {
    const list = Object.keys(DfcMilitaryOrderSignStartValue);
    for (let index = 0; index < list.length; index++) {
      const role = list[index];
      if (!['DFI_LEADER', 'PLANT_MANAGER', 'PM_HEAD', 'BU_HEAD'].includes(role)) {
        await this.searchChange(role);
      }
    }
    this.signBuMember();
    this.signPlantMember();
  }

  searchChange(role) {
    const getMemberList = (name: string) => {
      return this.militaryOrderSignService.sendMemberSelect(name, role, this.proCodeID);
    };
    const optionAddMemberList$: Observable<string[]> = this.signStartUp.select.list[role].searchChange$.asObservable()
      .pipe(debounceTime(500)).pipe(switchMap(getMemberList));
    optionAddMemberList$.subscribe(data => {
      this.signStartUp.select.list[role].selectList = data;
      this.signStartUp.select.list[role].isLoading = false;
    });
  }

  onSearch(value: string, role): void {
    this.signStartUp.select.list[role].isLoading = true;
    this.signStartUp.select.list[role].searchChange$.next(value);
  }

  async signBuMember(bu?) {
    const signBuDefaultMember = await this.militaryOrderSignService.sendMember(bu ? bu : this.signStartUp.bu);
    if (!!signBuDefaultMember['datas']) { // 若有默认 的 送签人信息 则向list中添加此信息
      const list = Object.keys(DfcMilitaryOrderSignStartValue);
      this.signStartUp.buWorkflowMapID = signBuDefaultMember['workflowMappingID'];
      for (let index = 0; index < list.length; index++) {
        const role = list[index];
        if (!!signBuDefaultMember['datas'][role]) {
          const picIDs = signBuDefaultMember['datas'][role].split(',');
          for (let j = 0; j < picIDs.length; j++) {
            const picID = picIDs[j];
            const member = await this.militaryOrderSignService.getMember(picID);
            if (!!member) {
              console.log(role);
              if (this.signStartUp.bg !== 'CSBG' && role !== 'BU_HEAD') {
                this.signStartUp.select.list[role].selectList.splice(0, 0, member);
              }

            }
          }
          if (this.signStartUp.bg !== 'CSBG' && role !== 'BU_HEAD') {
            this.signStartUp.select.value[role] = this.signStartUp.select.list[role].selectList[0]['Value'];
          }

        }
      }
    }
  }

  async signPlantMember(plant?) {
    const signPlantDefaultMember = await this.militaryOrderSignService.sendMember(plant ? plant : this.signStartUp.plant);
    if (!!signPlantDefaultMember['datas']) { // 若有默认 的 送签人信息 则向list中添加此信息
      const list = Object.keys(DfcMilitaryOrderSignStartValue);
      this.signStartUp.plantWorkflowMapID = signPlantDefaultMember['workflowMappingID'];
      for (let index = 0; index < list.length; index++) {
        const role = list[index];
        if (!!signPlantDefaultMember['datas'][role]) {
          const picIDs = signPlantDefaultMember['datas'][role].split(',');
          for (let j = 0; j < picIDs.length; j++) {
            const picID = picIDs[j];
            const member = await this.militaryOrderSignService.getMember(picID);
            if (!!member) {
              this.signStartUp.select.list[role].selectList.splice(0, 0, member);
            }
          }
          this.signStartUp.select.value[role] = this.signStartUp.select.list[role].selectList[0]['Value'];
        }
      }
    }
  }
}
