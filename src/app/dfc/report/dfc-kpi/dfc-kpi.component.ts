import {
  GroupModelMapping
} from './../../../service/dfc_sdk/sdk/models/GroupModelMapping';
import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Input
} from '@angular/core';
import {
  Observable,
  Subject,
  forkJoin,
  of
} from 'rxjs';
import {
  debounceTime,
  map,
  switchMap,
  mergeMap,
  takeUntil
} from 'rxjs/operators';
import {
  NzMessageService
} from 'ng-zorro-antd';
import {
  ActivatedRoute
} from '@angular/router';
import {
  DfcKpiQueryStyle,
  DfcKpiQuerySelect,
  ClsDfcKpiReward,
  ClsDfcKpiSelect
} from './dfc-kpi';
import {
  DfcKpiService
} from './dfc-kpi.service';
import {
  DownexcelService
} from '@service/downexcel.service';
import {
  ClsDfcMilitaryOrderQuery
} from '../../military-order/military-order-sign/military-order-sign';
import {
  MilitaryOrderSignService
} from '../../military-order/military-order-sign/military-order-sign.service';
import {
  DfcCommonService
} from 'app/shared/dfc-common/service/dfc-common.service';
import { GroupModelApi } from '@service/dfc_sdk/sdk/services/custom/GroupModel';
import { DfcSelectNewService } from 'app/dfc/dfc-select-new.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-dfc-kpi',
  templateUrl: './dfc-kpi.component.html',
  styleUrls: ['./dfc-kpi.component.scss']
})
export class DfcKpiComponent implements OnInit {
  @Input() modalWidth;
  @ViewChild('DFCKpiReport') dfcKpiReport: ElementRef;
  nzWidthConfig = ['90px', '90px', '100px', '100px', '100px', '90px', '150px', '150px', '120px', '100px', '90px', '100px', '100px', '90px', '110px', '90px', '90px', '60px'];
  tablePaging = true;
  nzScroll: { x: string, y: string };
  isSendSignVisible = false;
  PlantMapping = JSON.parse(localStorage.getItem('DFC_PlantMapping'));
  loadingshow = false;
  queryValue = new ClsDfcMilitaryOrderQuery();
  tabelHeight;

  // -----start----
  queryStyle = DfcKpiQueryStyle;
  querySelect = DfcKpiQuerySelect;
  // 設置加載狀態
  isTableLoading = false;
  // 下拉框传值
  selectValue: ClsDfcKpiSelect = {
    plant: '',
    bu: '',
    custom: '',
    modelType: [],
    standard: '',
    proCode: [],
    modelID: [],
    modelName: [],
    proName: [],
    cFlow: [],
    count: 0
  };

  dataSet = []; // 表格数据暂存
  stageIDs: number[] = []; // 暫存StageID值
  kpiReward: ClsDfcKpiReward;
  isVisibleRewards = false; // 獎懲是否顯示
  isVisibleRule = false; // 規則是否顯示

  // 全部的projectName
  tempProjectNameList = [];
  cacheProNameSearchList = [];
  cacheModelNameSearchList = [];
  rowData;
  DFiLeaderFlag = false;
  subject = new Subject();
  queryRewardId = 0;
  queryRewardType = 0;
  // ----- end ------
  trans = {};
  constructor(
    private dfcKpiService: DfcKpiService,
    private message: NzMessageService,
    private route: ActivatedRoute,
    private downExcelService: DownexcelService,
    private militaryOrderSignService: MilitaryOrderSignService,
    private dfcCommonService: DfcCommonService,
    private dfcSelectService: DfcSelectNewService,
    private groupModelService: GroupModelApi,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    // 初始化i18n;
    this.translate.get(['report.dfc-kpi-model-group', 'report.dfc-kpi-download', 'report.dfc-target-hour-notSign', 'report.dfc-kpi-no-reward-punish', 'report.dfc-not-sign-military',
      'mrr.mrr-plant', 'mrr.mrr-customer', 'mrr.mrr-product', 'report.dfc-kpi-compliance-status', 'dfq.dfq-cflow']).subscribe(res => {
        this.trans['modelGroup'] = res['report.dfc-kpi-model-group'];
        this.trans['download'] = res['report.dfc-kpi-download'];
        this.trans['target-hour-notSign'] = res['report.dfc-target-hour-notSign'];
        this.trans['no-reward-punish'] = res['report.dfc-kpi-no-reward-punish'];
        this.trans['not-sign-military'] = res['report.dfc-not-sign-military'];
        DfcKpiQueryStyle.plant.label = res['mrr.mrr-plant'];
        DfcKpiQueryStyle.custom.label = res['mrr.mrr-customer'];
        DfcKpiQueryStyle.modelType.label = res['mrr.mrr-product'];
        DfcKpiQueryStyle.standard.label = res['report.dfc-kpi-compliance-status'];
        DfcKpiQueryStyle.cFlow.label = res['dfq.dfq-cflow'];
      });
    // 當點擊切換語言
    this.translate.onLangChange.pipe(takeUntil(new Subject())).subscribe(cur => {
      this.translate.get(['report.dfc-kpi-model-group', 'report.dfc-kpi-download', 'report.dfc-target-hour-notSign', 'report.dfc-kpi-no-reward-punish', 'report.dfc-not-sign-military',
        'mrr.mrr-plant', 'mrr.mrr-customer', 'mrr.mrr-product', 'report.dfc-kpi-compliance-status', 'dfq.dfq-cflow']).subscribe(res => {
          this.trans['modelGroup'] = res['report.dfc-kpi-model-group'];
          this.trans['download'] = res['report.dfc-kpi-download'];
          this.trans['target-hour-notSign'] = res['report.dfc-target-hour-notSign'];
          this.trans['no-reward-punish'] = res['report.dfc-kpi-no-reward-punish'];
          this.trans['not-sign-military'] = res['report.dfc-not-sign-military'];
          DfcKpiQueryStyle.plant.label = res['mrr.mrr-plant'];
          DfcKpiQueryStyle.custom.label = res['mrr.mrr-customer'];
          DfcKpiQueryStyle.modelType.label = res['mrr.mrr-product'];
          DfcKpiQueryStyle.standard.label = res['report.dfc-kpi-compliance-status'];
          DfcKpiQueryStyle.cFlow.label = res['dfq.dfq-cflow'];
        });
    });
    this.querySelect.proCode.selectDisabled = true;
    this.DFILeader();
    // ---- start ----
    this.initPlantSelect();
    this.initBUSelect();
    this.initCustomSelect();
    this.initModelTypeSelect();
    this.initNameSelect();
    // --- end----
    this.nzScroll = {
      x: (this.nzWidthConfig.reduce((p, t) => {
        return p + parseInt(t, 10);
      }, 0)) + 'px',
      y: (this.dfcKpiReport.nativeElement.offsetHeight - 185) + 'px'
    };
    // 路由進入
    this.route.params.subscribe(route => {
      if (!route.plant || !route.modelID) {
        return;
      }
      this.selectValue.plant = route.plant;
      this.changePlant();
      if (route.stage) {
        this.selectValue.cFlow = [route.stage];
        this.boardQueryByModelID(route.modelID.split(','), route.stage);
      } else {
        const projectNameID = route.modelID.split(',');
        this.boardQuery(route.plant, projectNameID);
      }
    });
  }

  // 判斷是否是 DFI Leader權限
  DFILeader() {
    this.dfcCommonService.DFILeader().subscribe(data => {
      this.DFiLeaderFlag = data['DFILeader'] || data['IsPlantLevel'];
    });
  }

  // 初始化廠別下拉框
  initPlantSelect() {
    this.querySelect.plant.selectList = []; // 清空选择框中的值
    this.dfcSelectService.getPlant().subscribe(data => {
      this.querySelect.plant.selectList = data;
      this.getStagePlant();
    });
    // 对厂别自动带入本厂的标签
    this.selectValue.plant = localStorage.getItem('DFC_Plant');
    this.changePlant();
  }

  // 廠別下拉框選中改變后, 清空其他选则值 -- 客户, ProjectCode, ProjectName, 并重新查詢出 客戶的列表
  changePlant() {
    this.selectValue.bu = null;
    this.selectValue.custom = null;
    this.selectValue.proCode = [];
    this.selectValue.proName = [];
    this.querySelect.bu.selectList = [];
    this.querySelect.custom.selectList = [];
    this.querySelect.proCode.selectList = [];
    this.querySelect.proName.selectList = [];
    this.cacheProNameSearchList = [];
    this.querySelect.modelName.selectList = [];
    this.selectValue.modelName = [];
    this.selectValue.modelID = [];
    this.selectValue.cFlow = [];
    this.getStagePlant();
    this.searchProjectNameList(this.selectValue.plant).pipe(
      switchMap(
        () => {
          return this.dfcCommonService.filterProjectName(
            [this.selectValue.bu],
            [this.selectValue.custom],
            this.selectValue.modelType,
            this.tempProjectNameList
          );
        }
      ),
      map(
        (resData) => {
          this.querySelect.proName.selectList = resData;
          this.cacheProNameSearchList = [...resData];

        }
      )).subscribe();
    if (!!this.selectValue.plant) {
      this.buSearch('');
      this.customSearch('');
    }
  }

  // 初始化BU
  initBUSelect() {
    const getBUList = (bu: string) => {
      return this.dfcSelectService.getBU(this.selectValue.plant, bu);
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
    this.selectValue.custom = null;
    this.selectValue.proCode = [];
    this.selectValue.proName = [];
    this.querySelect.custom.selectList = [];
    this.querySelect.proCode.selectList = [];
    this.querySelect.proName.selectList = [];
    this.cacheProNameSearchList = [];
    this.selectValue.cFlow = [];
    this.querySelect.modelName.selectList = [];
    this.selectValue.modelName = [];
    this.selectValue.modelID = [];
    this.dfcCommonService.filterProjectName(
      [this.selectValue.bu],
      [this.selectValue.custom],
      this.selectValue.modelType,
      this.tempProjectNameList
    ).pipe(
      map(
        (resData: any) => {
          this.querySelect.proName.selectList = resData;
          this.cacheProNameSearchList = [...resData];
        }
      )
    ).subscribe();
    if (!!this.selectValue.plant) {
      this.customSearch('');
    }
  }

  // 初始化 客戶 下拉框
  initCustomSelect() {
    this.querySelect.custom.selectList = [];
    const getCustomList = (custom: string) => {
      if (!!this.selectValue.plant) {
        return this.dfcSelectService.getCustom(this.selectValue.plant, this.selectValue.bu, custom);
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
    this.selectValue.proCode = [];
    this.selectValue.proName = [];
    this.querySelect.proCode.selectList = [];
    this.querySelect.proName.selectList = [];
    this.cacheProNameSearchList = [];
    this.selectValue.cFlow = [];
    this.querySelect.modelName.selectList = [];
    this.selectValue.modelName = [];
    this.selectValue.modelID = [];
    this.dfcCommonService.filterProjectName(
      [this.selectValue.bu],
      [this.selectValue.custom],
      this.selectValue.modelType,
      this.tempProjectNameList
    ).pipe(
      map(
        (resData: any) => {
          this.querySelect.proName.selectList = resData;
          this.cacheProNameSearchList = [...resData];
        }
      )
    ).subscribe();
  }

  // 初始化產品下拉框
  initModelTypeSelect() {
    this.querySelect.modelType.selectList = []; // 清空選擇框的值
    this.dfcSelectService.getProductType().subscribe(datas => {
      this.querySelect.modelType.selectList = datas;
    });
  }

  proNameChange(value): void {
    this.querySelect.proName.selectList = [...this.cacheProNameSearchList];
    if (value.length === 0) {
      this.selectValue.proCode = [];
      this.selectValue.cFlow = [];
      this.querySelect.modelName.selectList = [];
      this.selectValue.modelName = [];
      this.selectValue.modelID = [];
      return;
    }
    // 顯示projectCode
    const projectCodeList = this.tempProjectNameList.filter(
      (item) => {
        const hasItem = value.find(
          (modelName) => {
            return modelName === Number(item.ProjectNameID);
          }
        );
        if (hasItem) {
          return item;
        }
      });
    const groupProjectCode = projectCodeList.map(item => item.ProjectCodeID).reduce((p, t) => {
      if (!p.includes(t)) {
        return [...p, t];
      }
      return p;
    }, []);
    this.dfcCommonService.getProjectCodeProfile(groupProjectCode).pipe(
      switchMap(
        (projectCodeData: any) => {
          projectCodeData = projectCodeData.map(
            (item) => {
              item.Value = item.ProjectCodeID;
              item.Label = item.ProjectCode;
              return item;
            }
          );
          this.selectValue.proCode = projectCodeData.map(item => item.Value);
          this.querySelect.proCode.selectList = projectCodeData;
          return this.dfcKpiService.getStageByProCodeChange(this.selectValue.proCode);
        }
      ),
      map(
        (cFlowItem) => {
          this.selectValue.cFlow = cFlowItem;
        }
      ),
      switchMap(
        () => {
          return this.dfcCommonService.getMappingModelName(value);
        }
      ),
      map(
        (modelNameSelect) => {
          const selectList = modelNameSelect.map(x => {
            return {
              Label: x.modelName,
              Value: x.type + '-' + x.modelId,
              Type: x.type
            };
          });
          this.querySelect.modelName.selectList = selectList;

          this.cacheModelNameSearchList = [...selectList];
          const modelReduce = modelNameSelect.reduce((p, t) => {
            if (!p['projectNameModel'][t['projectNameId']]) {
              p['projectNameModel'][t['projectNameId']] = t['type'] + '-' + t['modelId'];
            }
            if (!p['res'][t['modelId']]) {
              p['res'][t['modelId']] = t;
            }
            p['modelID'].push(t['modelId']);
            return p;
          }, {
            'projectNameModel': {},
            'res': {},
            'modelID': []
          });
          this.selectValue.modelID = this.selectValue.modelID.filter(d => modelReduce['modelID'].includes(d));
          this.selectValue.modelID.forEach(d => {
            delete modelReduce['projectNameModel'][modelReduce['res'][d]['projectNameId']];
          });
          for (const proName in modelReduce['projectNameModel']) {
            if (modelReduce['projectNameModel'].hasOwnProperty(proName)) {
              const modelId = modelReduce['projectNameModel'][proName];
              this.selectValue.modelID.push(modelId);
            }
          }
          this.modelNameChange('');
        }
      )
    ).subscribe();
  }

  proNameSearch(value) {
    this.querySelect.proName.selectList = this.cacheProNameSearchList.filter(d => d.Label.includes(value));
  }

  // 初始化 ProName, ModelName 下拉框
  initNameSelect() {
    // ModelName
    const getModelNameList = (model: string) => {
      return of(model);
    };
    const getModelNameList$: Observable<string> = this.querySelect.modelName.searchChange$.asObservable()
      .pipe(debounceTime(500)).pipe(switchMap(getModelNameList));
    getModelNameList$.subscribe(datas => {
      this.querySelect.modelName.selectList = this.cacheModelNameSearchList.filter(d => d.Label.includes(datas));
      this.querySelect.modelName.isLoading = false;
    });
  }

  modelNameSearch(value) {
    this.querySelect.modelName.isLoading = true;
    this.querySelect.modelName.searchChange$.next(value);
  }

  modelNameChange(value) {
    this.querySelect.modelName.selectList = [...this.cacheModelNameSearchList];
    this.selectValue.modelName = this.selectValue.modelID.map(d => {
      const model = d.split('-');
      return {
        id: parseInt(model[1], 10),
        type: parseInt(model[0], 10)
      };
    });
  }

  getStagePlant() {
    // 根據config判斷出 某些機種沒有 C0~C1
    const stageShowFlag = false;
    const addStage = [{ Value: 'C0', Label: 'C0' }, { Value: 'C1', Label: 'C1' }];
    if (stageShowFlag) {
      if (this.querySelect.cFlow.selectList.length < 7) {
        this.querySelect.cFlow.selectList.splice(0, 0, ...addStage);
      }
    } else {
      if (this.querySelect.cFlow.selectList.length === 7) {
        this.querySelect.cFlow.selectList.splice(0, 2);
      }
    }
  }

  async queryByIds(data) {
    this.dataSet = [];
    this.loadingshow = true;
    this.dfcKpiService.queryKpiDataByIds(this.selectValue.plant, data).subscribe(x => {
      let dataSet = [];
      x.forEach(y => {
        dataSet.push(...y['dataSet']);
      });
      if (this.selectValue.standard) {
        dataSet = dataSet.filter(y => y.status === this.selectValue.standard);
      }
      this.dataSet = dataSet.sort(this.sortDataSet);
      this.loadingshow = false;
    });
  }

  sortDataSet(a, b) {
    const x = a.projectNameId;
    const y = b.projectNameId;
    const aType = a.type;
    const bType = b.type;
    const aModel = a.modelId;
    const bModel = b.modelId;
    const aCFlow = a.stage;
    const bCFlow = b.stage;
    if (x < y) {
      return -1;
    } else if (x > y) {
      return 1;
    }
    if (aType < bType) {
      return -1;
    } else if (aType > bType) {
      return 1;
    }
    if (aModel < bModel) {
      return -1;
    } else if (aModel > bModel) {
      return 1;
    }
    if (aCFlow < bCFlow) {
      return -1;
    } else if (aCFlow > bCFlow) {
      return 1;
    }
    return 0;
  }

  // 查詢表格數據
  async query() {
    this.dataSet = [];
    this.loadingshow = true;
    this.dfcKpiService.queryKpiData(this.selectValue).subscribe(x => {
      let dataSet = x['dataSet'].sort(this.sortDataSet);
      if (this.selectValue.standard) {
        dataSet = dataSet.filter(y => y.status === this.selectValue.standard);
      }
      this.dataSet = dataSet;
      this.loadingshow = false;
    });
  }

  async boardQueryByModelID(modelIDs, stage) {
    const models = modelIDs.map(
      modelID => {
        return {
          id: modelID,
          type: 1,
          cFlow: stage
        };
      }
    );
    this.queryByIds(models);
  }

  // board进来的查询资料
  async boardQuery(plant, projectNameId) {
    this.selectValue.plant = plant;
    this.changePlant();
    this.selectValue.proName = projectNameId;
    this.proNameChange(projectNameId);
    const model = this.dfcCommonService.getModel({
      projectNameId: {
        inq: projectNameId
      }
    });
    const group = this.dfcCommonService.getGroupModel({
      projectNameId: {
        inq: projectNameId
      }
    });
    const projectNameInfo = (await this.dfcCommonService.getProjectName([plant], null, projectNameId).toPromise()).filter(x => x['Stage'] === x['CurrentStage']);
    forkJoin(model, group).subscribe(result => {
      const basicModels = result[0].map(x => {
        return {
          id: x.modelId,
          type: 1,
          cFlow: projectNameInfo.find(y => y['ProjectNameID'] + '' === x.projectNameId + '')['Stage']
        };
      });
      const groupModels = result[1].map(x => {
        return {
          id: x.groupModelId,
          type: 2,
          cFlow: projectNameInfo.find(y => y['ProjectNameID'] + '' === x.projectNameId + '')['Stage']
        };
      });
      const allModel = [...basicModels, ...groupModels];
      this.queryByIds(allModel);
    });
  }

  async onClickCFlow(stageID, cFlow, ProjectName, workTargetData?) {
    if (!!workTargetData) {
      if (workTargetData.type === 1) {
        const queryRfq = await this.dfcKpiService.getRfqStageID(workTargetData);
        stageID = queryRfq['stages'][0]['StageID'];
        cFlow = 'RFQ';
      } else {
        this.message.create('error', this.trans['modelGroup']);
        return;
      }
    }
    if (cFlow === 'RFQ') {
      window.open('/dashboard/dfc/target-report/' + stageID + '/A');
    } else {
      window.open('/dashboard/dfc/workhour-report/' + stageID + '/A');
    }
  }

  onClickMoh(data) {
    window.open('/dashboard/dfc/model-moh/' + data.plant + '/' + data.modelId + '/' + data.type + '/' + data.stage);
  }

  onClickWorkhour(data) {
    window.open('/dashboard/dfc/model-workhour/' + data.plant + '/' + data.productType + '/' + data.modelId + '/' + data.type + '/' + data.stage);
  }

  onClickTargethour(data) {
    window.open('/dashboard/dfc/target-hours/' + data.modelId);
  }


  // 下載資料
  download() {
    if (this.dataSet.length < 1) {
      this.message.create('error', this.trans['download']);
      return;
    }
    this.tablePaging = false;
    const table = document.getElementById('downdata');
    setTimeout(() => {
      this.downExcelService.exportTableAsExcelFile(table, 'workHour');
      this.tablePaging = true;
    }, 300);
  }

  searchModel(data) {
    data.modelData = [];
    this.loadingshow = true;
    let countData;
    this.groupModelService.getGroupModelMappings(data.modelId).pipe(
      mergeMap((x: GroupModelMapping[]) => {
        countData = x;
        const a = new ClsDfcKpiSelect();
        a.plant = data.plant;
        a.cFlow = [data.stage];
        a.modelName = x.map(y => {
          return {
            id: y.modelId,
            type: 1
          };
        });
        return this.dfcKpiService.queryKpiData(a);
      })
    ).subscribe({
      next: x => {
        x['dataSet'].forEach(y => {
          y.count = countData.find(z => z.modelId === y.modelId).count;
          data.modelData = [...data.modelData, y];
        });
      },
      complete: () => {
        this.loadingshow = false;
      }
    });
  }


  nzExpandChange(event, data) {
    if (event) {
      this.searchModel(data);
    } else {
      delete data.modelData;
    }
  }

  //  --- start----
  async clickRewards(data: ClsDfcKpiReward, rowData) {
    if (!rowData.targetSignFlag) {
      this.message.create('error', this.trans['target-hour-notSign']);
      return;
    }
    if (rowData.kpiReward.msg) {
      if (rowData.militaryFlag) {
        if (data.content.length > 0) {
          this.kpiReward = data;
          data.members = await this.dfcKpiService.getMembers(rowData);
          this.rowData = rowData;
          this.queryRewardType = rowData.type;
          this.queryRewardId = rowData.modelId;
          this.isVisibleRewards = true;
        } else {
          this.message.create('error', this.trans['no-reward-punish']);
        }
      } else {
        this.message.create('error', this.trans['not-sign-military']);
      }
    }
  }

  // 是否显示手指
  clickRewardsStyle(data: ClsDfcKpiReward) {
    if (data.content.length > 0) {
      return { cursor: 'pointer' };
    }
  }

  // 是否显示手指
  clickRewardsClass(rowData) {
    if (!rowData.targetSignFlag) {
      return 'red-circle';
    }
  }

  // 查看Rule
  viewRule(event) {
    if (event === 'rule') {
      this.isVisibleRule = true;
    } else {
      this.queryValue.plant = this.rowData['plant'];
      this.queryValue.proName = this.rowData['projectNameId'];
      this.queryValue.modelType = this.rowData['productType'];
      this.isSendSignVisible = true;
      this.militaryOrderSignService.querySign(this.queryValue).then(data => {
        this.militaryOrderSignService.querySignPush(data);
      });
    }
  }

  cancelSendSign() {
    this.isSendSignVisible = false;
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

  ruleBack(value) {
    if (value) {
      this.isVisibleRewards = true;
    }
  }

  redirectDFCDataVerication(stageId) {
    window.open('/dashboard/dfc/workhour-validation/' + stageId);
  }
}
