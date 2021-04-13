import { TranslateService } from '@ngx-translate/core';
import { ProjectNameProfileApi } from '@service/dfc_sdk/sdk';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { DfcSummaryQueryStyle, DfcSummaryQuerySelect } from './target-hour-sign';
import { Observable, of } from 'rxjs';
import { debounceTime, switchMap, map } from 'rxjs/operators';
import { TargetHourSignService } from './target-hour-sign.service';
import { ActivatedRoute } from '@angular/router';
import { DfcCommonService } from 'app/shared/dfc-common/service/dfc-common.service';
import { DfcSelectNewService } from 'app/dfc/dfc-select-new.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-target-hour-sign',
  templateUrl: './target-hour-sign.component.html',
  styleUrls: ['./target-hour-sign.component.scss']
})
export class TargetHourSignComponent implements OnInit, OnDestroy {
  @ViewChild('DFCTargetSign') dfcTargetSign: ElementRef;
  page = 0;
  Processroute = {};
  // 下拉框
  queryStyle = DfcSummaryQueryStyle;
  queryValue = { plant: '', bu: '', custom: '', modelType: '', proCode: '', proName: '', signStage: '', searchUser: '', model: '' };
  querySelect = DfcSummaryQuerySelect;

  // 表格相關
  nzWidthConfig = ['100px', '100px', '100px', '100px', '150px', '150px', '150px', '80px', '100px', '100px', '100px', '200px', '100px'];
  dataSet = [];
  nzScroll: {} = { x: '1530px' };

  // 工廠的value和label映射表
  PlantMapping = JSON.parse(localStorage.getItem('DFC_PlantMapping'));

  // 所有的project Name
  tempProjectNameList = [];
  querySelectOther = {
    tempProCodeData: {}, // 暫存 Project Code 內容
  };
  destroy$ = new Subject();

  constructor(
    private dfcSelectService: DfcSelectNewService,
    private targetHourSignService: TargetHourSignService,
    private dfcCommonService: DfcCommonService,
    private route: ActivatedRoute,
    private projectNameProfileServer: ProjectNameProfileApi,
    private translate: TranslateService
  ) {
  }
  async ngOnInit() {
    // 初始化I18N;
    this.translate.get(['dfq.dfq-plant', 'dfq.dfq-customer', 'dfq.dfq-product', 'dfq.dfq-sing-status', 'dfq.dfq-signer']).subscribe(res => {
      this.queryStyle.plant.label = res['dfq.dfq-plant'];
      this.queryStyle.custom.label = res['dfq.dfq-customer'];
      this.queryStyle.modelType.label = res['dfq.dfq-product'];
      this.queryStyle.signStage.label = res['dfq.dfq-sing-status'];
      this.queryStyle.searchUser.label = res['dfq.dfq-signer'];
    });
    // 當點擊切換語言
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(cur => {
      this.translate.get(['dfq.dfq-plant', 'dfq.dfq-customer', 'dfq.dfq-product', 'dfq.dfq-sing-status', 'dfq.dfq-signer']).subscribe(res => {
        this.queryStyle.plant.label = res['mrr.nudd-process'];
        this.queryStyle.custom.label = res['dfq.dfq-customer'];
        this.queryStyle.modelType.label = res['dfq.dfq-product'];
        this.queryStyle.signStage.label = res['dfq.dfq-sing-status'];
        this.queryStyle.searchUser.label = res['dfq.dfq-signer'];
      });
    });
    // ---- start ----
    await this.initPlantSelect();
    await this.initBUSelect();
    await this.initCustomSelect();
    await this.initModelTypeSelect();
    await this.initUserSelect();
    await this.initProNameSelect();
    await this.initModelSelect();
    this.querySelect.proCode.selectDisabled = true;
    this.nzScroll = { x: '1080px', y: (this.dfcTargetSign.nativeElement.offsetHeight - 240) + 'px' };
    this.route.queryParams.subscribe(param => {
      if (param['Plant'] && param['ProjectNameID']) {
        this.queryValue.plant = param['Plant'];
        this.changePlant();
        this.projectNameProfileServer.findById(param['ProjectNameID']).subscribe(proName => {
          this.querySelect.proName.selectList.push({ Value: proName['ProjectNameID'], Label: proName['ProjectName'] });
          this.querySelect.proCode.selectList.push({ Value: proName['ProjectCodeID'], Label: proName['ProjectCode'] });
          this.queryValue.proName = proName['ProjectNameID'];
          this.queryValue.proCode = proName['ProjectCodeID'];
          this.modelSelect();
          this.query();
        });
      }
    });
    this.route.queryParams.subscribe(params => {
      if (
        params['signID'] &&
        params['formID']
      ) {
        this.onClickProcess(
          Number(params['signID']),
          Number(params['formID']),
          Number(params['stageID']),
          Number(params['proName']),
          params['processCode'],
          params['process'],
        );
        this.queryValue.searchUser = localStorage.getItem('$DFI$userID');
        this.dfcSelectService.getMember(localStorage.getItem('$DFI$userID')).subscribe(datas => {
          this.querySelect.searchUser.selectList.push(...datas);
        });
      }
    });
  }

  // 初始化廠別下拉框
  initPlantSelect() {
    this.querySelect.plant.selectList = [];  // 清空选择框中的值
    this.dfcSelectService.getPlant().subscribe(datas => this.querySelect.plant.selectList = datas);
    // 对厂别自动带入本厂的标签
    this.queryValue.plant = localStorage.getItem('DFC_Plant');
    this.changePlant();
  }

  // 廠別下拉框選中改變后, 清空其他选则值 -- 客户, ProjectCode, ProjectName, 并重新查詢出 客戶的列表
  changePlant() {
    this.queryValue.bu = '';
    this.queryValue.custom = '';
    this.queryValue.proCode = '';
    this.queryValue.proName = '';
    this.queryValue.model = '';
    this.querySelect.bu.selectList = [];
    this.querySelect.custom.selectList = [];
    this.querySelect.proCode.selectList = [];
    this.querySelect.proName.selectList = [];
    this.querySelect.model.selectList = [];
    if (!!this.queryValue.plant) {
      this.buSearch('');
      this.customSearch('');
      this.querySelect.proName.searchChange$.next('');
      this.querySelect.model.searchChange$.next('');
    }
  }

  // 初始化BU
  initBUSelect() {
    const getBUList = (bu: string) => {
      return this.dfcSelectService.getBU(this.queryValue.plant, bu);
    };
    const buList$: Observable<string[]> = this.querySelect.bu.searchChange$.asObservable()
      .pipe(debounceTime(500)).pipe(switchMap(getBUList));

    buList$.subscribe(datas => {
      this.querySelect.bu.selectList = datas.filter(data => {
        return !(!data);
      });
      this.querySelect.bu.isLoading = false;
    });
  }

  buSearch(value: string) {
    this.querySelect.bu.isLoading = true;
    this.querySelect.bu.searchChange$.next(value);
  }

  changeBU() {
    this.queryValue.custom = '';
    this.queryValue.proCode = '';
    this.queryValue.proName = '';
    this.queryValue.model = '';
    this.querySelect.custom.selectList = [];
    this.querySelect.proCode.selectList = [];
    this.querySelect.proName.selectList = [];
    this.querySelect.model.selectList = [];
    if (!!this.queryValue.plant) {
      this.customSearch('');
      this.querySelect.proName.searchChange$.next('');
      this.querySelect.model.searchChange$.next('');
    }
  }

  // 初始化 客戶 下拉框
  initCustomSelect() {
    this.querySelect.custom.selectList = [];
    const getCustomList = (custom: string) => {
      if (!!this.queryValue.plant) {
        return this.dfcSelectService.getCustom(this.queryValue.plant, this.queryValue.bu, custom);
      }
    };
    const customList$: Observable<string[]> = this.querySelect.custom.searchChange$.asObservable()
      .pipe(debounceTime(500)).pipe(switchMap(getCustomList));

    customList$.subscribe(datas => {
      this.querySelect.custom.selectList = datas.filter(data => {
        return !(!data);
      });
      this.querySelect.custom.isLoading = false;
    });
  }

  customSearch(value: string): void {
    this.querySelect.custom.isLoading = true;
    this.querySelect.custom.searchChange$.next(value);
  }

  // 客戶下拉框 值改變, 清空 ProjectCode, ProjectName的值
  changeCustomAndModelType() {
    this.queryValue.proCode = '';
    this.queryValue.proName = '';
    this.queryValue.model = '';
    this.querySelect.proCode.selectList = [];
    this.querySelect.proName.selectList = [];
    this.querySelect.model.selectList = [];
    this.querySelect.proName.searchChange$.next('');
    this.querySelect.model.searchChange$.next('');
  }

  // 初始化產品下拉框
  initModelTypeSelect() {
    this.querySelect.modelType.selectList = []; // 清空選擇框的值
    this.dfcSelectService.getProductType().subscribe(datas => this.querySelect.modelType.selectList = datas);
  }

  // 幾種下拉框
  initProNameSelect() {
    // 搜索相關查詢
    const searchProNameList = (pName?) => {
      return of(pName);
    };
    const searchProNameList$: Observable<string[]> = this.querySelect.proName.searchChange$.asObservable().pipe(debounceTime(500)).pipe(switchMap(searchProNameList));
    // 下拉框的值改變后，更改下一個下拉框中的值
    searchProNameList$.subscribe(datas => {
      this.proNameSelect(
        this.queryValue.plant,
        this.queryValue.bu,
        this.queryValue.custom,
        this.queryValue.modelType,
        datas); // 改變Plant的值
    });
  }

  proNameSelect(plant?, bu?, custom?, productType?, proName?) {
    this.dfcSelectService.getProName(plant, bu, custom, productType, proName).subscribe(data => {
      this.querySelect.proName.selectList = data['proName'];
      this.querySelectOther.tempProCodeData = data['proCode'];
    });
  }

  proNameChange(datas) {
    this.querySelect.proCode.selectList = !!this.querySelectOther.tempProCodeData[datas] ? [this.querySelectOther.tempProCodeData[datas]] : [];
    this.queryValue.proCode = !!this.querySelectOther.tempProCodeData[datas] ? this.querySelectOther.tempProCodeData[datas]['Value'] : '';
    if (!datas) {
      this.queryValue.model = '';
      this.querySelect.model.selectList = [];
      return;
    }
    this.modelSelect(datas);
  }

  // Model下拉框
  initModelSelect() {
    // 搜索相關查詢
    const searchModelList = (model?) => {
      return of(model);
    };
    const searchModelList$: Observable<string[]> = this.querySelect.model.searchChange$.asObservable().pipe(debounceTime(500)).pipe(switchMap(searchModelList));
    // 下拉框的值改變后，更改下一個下拉框中的值
    searchModelList$.subscribe(datas => {
      if (!!this.queryValue.proName) {
        this.modelSelect(this.queryValue.proName, datas); // 改變Plant的值
      }
    });
  }

  modelSelect(proName?, model?) {
    this.dfcSelectService.getModel(proName, model).subscribe(datas => {
      this.querySelect.model.selectList = datas['list'];
      if (!!this.queryValue.proName) {
        this.queryValue.model = datas['def'];
      }
    });
  }

  // 初始化簽核人員搜索下拉框
  initUserSelect() {
    // 搜索相關查詢
    const searchUserList = (name?) => {
      return of(name);
    };
    const searchUserList$: Observable<string[]> = this.querySelect.searchUser.searchChange$.asObservable()
      .pipe(debounceTime(500)).pipe(switchMap(searchUserList));
    // 下拉框的值改變后，更改下一個下拉框中的值
    searchUserList$.subscribe(datas => {
      this.searchUserSelect(datas); // 改變Plant的值
    });
  }

  searchUserSelect(name?) {
    this.dfcSelectService.getMember(name).subscribe(data => this.querySelect.searchUser.selectList = data);
  }

  async query() {
    this.targetHourSignService.query(this.queryValue).then(datas => this.dataSet = datas);
  }

  onClickProcess(signID, formNo, stageID, proNameID, processCode, process) {
    this.Processroute = {
      'signID': signID,
      'formNo': formNo,
      'stageID': stageID,
      'proNameID': proNameID,
      'processCode': processCode,
      'process': process
    };
    this.page = 1;
  }

  // 撈全部的projectName
  searchProjectNameList(plant) {
    return this.dfcCommonService.getProjectName([plant]).pipe(
      map(
        (res) => {
          this.tempProjectNameList = res;
        }
      )
    );
  }

  pageroute(event) {
    this.page = event;
    this.query();
  }

  // 撤回簽核
  revoke(signID) {
    this.targetHourSignService.revoke(signID).subscribe(data => {
      this.query();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
