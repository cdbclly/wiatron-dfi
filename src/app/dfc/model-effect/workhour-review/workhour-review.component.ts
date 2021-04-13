import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { debounceTime, map, switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { DfcKpiQueryStyle, DfcKpiQuerySelect, ClsDfcKpiSelect } from './workhour-review';
import { WorkhourReviewService, DFCTargetHourTableData } from './workhour-review.service';
import { DfcCommonService } from 'app/shared/dfc-common/service/dfc-common.service';
import { NzMessageService } from 'ng-zorro-antd';
import { DfcSelectNewService } from 'app/dfc/dfc-select-new.service';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';
@Component({
  selector: 'app-workhour-review',
  templateUrl: './workhour-review.component.html',
  styleUrls: ['./workhour-review.component.scss']
})
export class WorkhourReviewComponent implements OnInit, OnDestroy {
  @ViewChild('DFCWorkhourReview') dfcWorkhourReview: ElementRef;
  tableHeight;
  queryDetailStageID;
  queryDetailProcess;
  page = 'first';
  PlantMapping = JSON.parse(localStorage.getItem('DFC_PlantMapping'));

  datas;
  target;
  i = 1;
  data1;
  value;
  rfqID;
  queryStyle = DfcKpiQueryStyle;
  querySelect = DfcKpiQuerySelect;
  nzWidthConfig = [];
  nzWidthConfigs: any = {};
  kanbanFlag = false;
  kanban = {
    plant: '',
    custom: '',
    modelType: '',
    proCode: '',
    proName: '',
    modelName: '',
    cFlow: ''
  };
  cFlow;
  // 下拉框传值
  plantSelectValue;
  selectValue: ClsDfcKpiSelect = {
    plant: '',
    custom: '',
    modelType: '',
    Process: '',
    proCode: [],
    modelName: -1,
    proName: [],
    cFlow: [],
  };
  DFCTargetHourTableData: DFCTargetHourTableData;
  datatot1 = {};
  datatot2 = [];
  isTableLoading = false; // 设置细项展示按钮是否为加载状态
  isItemOrGap = true; // 是否为差异项/细项, false --- 细项, true --- 差异项
  itemTable = []; // 细项的数据
  defultDueDay = new Date().toLocaleDateString();
  saveFlag = false; // 存儲標記--為了讓存的時候不會再去變化現有表格, 實現表格固定
  editFlag = false; // 編輯狀態標誌 -- 編輯時顯示  是否變更項
  sendEmailLoading = false; // 設置Email發送按鈕 是否為加載狀態.  -- 點擊按鈕, 1分鐘后才可以再次點擊
  // 文件上傳下載相關
  fileToUpload: File = null;
  uploadFileName = '';
  showLoading = false;
  // echart
  optionsFirst: {};
  optionsSecond: {};
  FirstEchartParam = {
    legendData: [],
    series: []
  };
  SecondEchartParam = {
    xAxisData: [],
    seriesData1: [],
    seriesData2: [],
  };
  stageID: string[];
  proCodeID: string[];
  process: string;
  proCode: string;
  proName: string;
  gapList: {
    value: number,
    name: string
  }[] = [];
  gapValue: number[] = [];
  gapOthers = 0;
  processTarget: string; // 第二頁中 頁面上的 製程顯示
  dateFormat = 'yyyy/MM/dd'; // 日期格式显示
  // 表格
  listOfStatusSelectOption = [
    { Value: 0, Label: 'Open' },
    { Value: 1, Label: 'Ongoing' },
    { Value: 2, Label: 'Close' }
  ];
  processlist = [
    { Value: 'A', Label: 'Ass\'y' },
    { Value: 'DA', Label: 'DIP' },
    { Value: 'P', Label: 'Packing' },
    { Value: 'T', Label: 'Test' }
  ];
  // 表格中 目標設計下拉框
  detaillist;
  targetFactorDetailSelectValue: string; // 下拉框选值
  listOfTargetFactorDetailSelectOption = {}; // 下拉框内容

  // 全部的projectName
  tempProjectNameList = [];
  cacheProNameSearchList = [];
  cacheModelNameSearchList = [];
  destroy$ = new Subject();
  timeFlag = 'a';
  trans: Object = {};

  constructor(
    private workhourQueryService: WorkhourReviewService,
    private route: ActivatedRoute,
    private dfcCommonService: DfcCommonService,
    private dfcSelectService: DfcSelectNewService,
    private message: NzMessageService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    console.log(this.dfcWorkhourReview.nativeElement);
    // 初始化I18N;
    this.translate.get(['dfq.dfq-plant', 'dfq.dfq-product', 'dfq.dfq-customer', 'dfq.dfq-cflow', 'report.select-all']).subscribe(res => {
      this.queryStyle.plant.label = res['dfq.dfq-plant'];
      this.queryStyle.custom.label = res['dfq.dfq-customer'];
      this.queryStyle.modelType.label = res['dfq.dfq-product'];
      this.queryStyle.cFlow.label = res['dfq.dfq-cflow'];
      this.trans['selectAll'] = res['report.select-all'];
    });
    // 當點擊切換語言
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(cur => {
      this.translate.get(['dfq.dfq-plant', 'dfq.dfq-product', 'dfq.dfq-customer', 'dfq.dfq-cflow', 'report.select-all']).subscribe(res => {
        this.queryStyle.plant.label = res['dfq.dfq-plant'];
        this.queryStyle.custom.label = res['dfq.dfq-customer'];
        this.queryStyle.modelType.label = res['dfq.dfq-product'];
        this.queryStyle.cFlow.label = res['dfq.dfq-cflow'];
        this.trans['selectAll'] = res['report.select-all'];
      });
    });
    this.tableHeight = (this.dfcWorkhourReview.nativeElement.offsetHeight - 240) + 'px';
    this.querySelect.proName.selectDisabled = false;
    this.querySelect.proCode.selectDisabled = true;
    this.route.params.subscribe(r => {
      if (r.stageID && r.process) {
        this.QueryDetail(r.stageID, r.process);
      }
    });
    // ---- start ----
    this.initPlantSelect();
    this.initCustomSelect();
    this.initModelTypeSelect();
    this.initProcessSelect();
    this.initNameSelect();
    // --- end----
    this.nzWidthConfigs = {
      edit: {
        nzWidthConfig: ['120px', '150px', '150px', '150px', '120px', '120px', '120px', '90px', '200px',
          '120px', '120px', '120px', '120px', '150px', '120px', '120px', '140px', '120px', '120px', '120px', '120px',
          '120px', '150px', '100px'],
        nzScroll: { x: '2990px', y: '1000px' }
      },
      notdo: {
        nzWidthConfig: ['120px', '150px', '150px', '150px', '120px', '120px', '120px', '200px',
          '120px', '120px', '120px', '120px', '150px', '120px', '120px', '140px', '120px', '120px', '120px',
          '120px', '150px', '100px'],
        nzScroll: { x: '2870px', y: '1000px' }
      }
    };
    this.nzWidthConfig = this.nzWidthConfigs.notdo.nzWidthConfig;
  }

  // 切換頁面
  clickSwitch() {
    this.page = 'first';
  }

  // 初始化廠別下拉框
  initPlantSelect() {
    this.querySelect.plant.selectList = [];  // 清空选择框中的值
    this.dfcSelectService.getPlant().subscribe(data => {
      this.querySelect.plant.selectList = data;
      this.getStagePlant();
    });
    // 对厂别自动带入本厂的标签
    this.selectValue.plant = localStorage.getItem('DFC_Plant');
    // 獲取初始的廠名
    this.changePlant();
  }

  // 廠別下拉框選中改變后, 清空其他选则值 -- 客户, ProjectCode, ProjectName, 并重新查詢出 客戶的列表
  changePlant() {
    this.selectValue.custom = null;
    this.selectValue.proCode = null;
    this.selectValue.proName = null;
    this.selectValue.modelName = null;
    this.querySelect.custom.selectList = [];
    this.querySelect.proCode.selectList = [];
    this.querySelect.proName.selectList = [];
    this.querySelect.modelName.selectList = [];
    this.cacheProNameSearchList = [];
    this.getStagePlant();
    const userplant = this.querySelect.plant.selectList.find(data => data.Value === this.selectValue.plant);
    if (userplant) {
      if (!!this.selectValue.plant) {
        this.customSearch('');
      }
    }
    this.searchProjectNameList(this.selectValue.plant).pipe(
      switchMap(
        () => {
          return this.dfcCommonService.filterProjectName(
            [],
            [this.selectValue.custom],
            [this.selectValue.modelType],
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
  }

  // 初始化 客戶 下拉框
  initCustomSelect() {
    this.querySelect.custom.selectList = [];
    const getCustomList = (custom: string) => {
      if (!!this.selectValue.plant) {
        return this.workhourQueryService.getProCodeCustom(custom, this.selectValue.plant).pipe(map((list: any) => {
          const temp = [];
          return list.map(item => {
            if (!temp.includes(item.Customer) && !!item.Customer) {
              temp.push(item.Customer);
              return { Value: item.Customer, Label: item.Customer };
            }
          });
        }));
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
  changeCustom() {
    this.selectValue.proCode = null;
    this.selectValue.proName = null;
    this.selectValue.modelName = null;
    this.querySelect.modelName.selectList = [];
    this.querySelect.modelType.selectDisabled = false;
    this.dfcCommonService.filterProjectName(
      [],
      [this.selectValue.custom],
      [this.selectValue.modelType],
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

  // 產品下拉框值改變的影響
  changeModelType() {
    this.selectValue.proCode = null;
    this.selectValue.proName = null;
    this.selectValue.modelName = null;
    this.querySelect.modelName.selectList = [];
    this.querySelect.proCode.selectList = [];
    this.querySelect.proName.selectList = [];
    this.cacheProNameSearchList = [];
    this.dfcCommonService.filterProjectName(
      [],
      [this.selectValue.custom],
      [this.selectValue.modelType],
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

  // 初始化製程下拉框
  initProcessSelect() {
    this.querySelect.Process.selectList = [];
    this.workhourQueryService.getProcess().subscribe(datas => {
      datas.forEach(data => {
        this.querySelect.Process.selectList.push({ Value: data['ProcessCode'], Label: data['Name'] });
      });
    });
  }

  // 初始化 ProName, ModelName 下拉框
  initNameSelect() {
    // ProName
    const getProNameList = (proName: string) => {
      if (!!this.selectValue.plant) {
        return of(proName);
      } else {
        return of('');
      }
    };
    const getProNameList$: Observable<string> = this.querySelect.proName.searchChange$.asObservable()
      .pipe(debounceTime(500)).pipe(switchMap(getProNameList));
    getProNameList$.subscribe(datas => {
      this.querySelect.proName.selectList = this.cacheProNameSearchList.filter(d => d.Label.includes(datas));
      this.querySelect.proName.isLoading = false;
    });
    // ModelName
    const getModelNameList = (model: string) => {
      if (!!this.selectValue.proName) {
        return of(model);
      } else {
        return of('');
      }
    };
    const getModelNameList$: Observable<string> = this.querySelect.modelName.searchChange$.asObservable()
      .pipe(debounceTime(500)).pipe(switchMap(getModelNameList));
    getModelNameList$.subscribe(datas => {
      this.querySelect.modelName.selectList = this.cacheModelNameSearchList.filter(d => d.Label.includes(datas));
      this.querySelect.modelName.isLoading = false;
    });
  }

  // Project Name
  proNameSearch(value): void {
    this.querySelect.proName.isLoading = true;
    this.querySelect.proName.searchChange$.next(value);
  }

  proNameChange(value): void {
    this.querySelect.proName.selectList = [...this.cacheProNameSearchList];
    if (!value) {
      this.selectValue.proCode = [];
      this.selectValue.cFlow = [];
      this.querySelect.cFlow.selectDisabled = true;
      this.selectValue.modelName = null;
      this.querySelect.modelName.selectList = [];
      return;
    }
    const projectCode = this.tempProjectNameList.find(
      (item) => {
        if (Number(item.ProjectNameID) === value) {
          return item;
        }
      });
    this.dfcCommonService.getProjectCodeProfile([projectCode.ProjectCodeID]).pipe(
      map(
        (projectCodeData: any) => {
          projectCodeData = projectCodeData.map(
            (item) => {
              item.Value = item.ProjectCodeID;
              item.Label = item.ProjectCode;
              return item;
            }
          );
          this.selectValue.proCode = projectCodeData[0].ProjectCodeID;
          this.querySelect.proCode.selectList = projectCodeData;
          this.querySelect.cFlow.selectDisabled = false;
        }
      )).subscribe();
    this.dfcCommonService.getMappingModelName([value]).subscribe(
      x => {
        const modelNames = x.filter(y => y.type === 1).map(y => ({ Value: y.modelId, Label: y.modelName }));
        this.querySelect.modelName.selectList = modelNames;
        this.cacheModelNameSearchList = [...modelNames];
        this.selectValue.modelName = modelNames[0]['Value'];
      }
    );
    this.querySelect.modelName.selectDisabled = false;
  }

  onModelChange(value) {
    this.querySelect.modelName.selectList = [...this.cacheModelNameSearchList];
  }

  onModelSearch(value) {
    this.querySelect.modelName.isLoading = true;
    this.querySelect.modelName.searchChange$.next(value);
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

  kanbanShow() {
    this.kanbanFlag = true;
    const plant = this.PlantMapping.find(d => d.Plant === this.selectValue.plant);
    const proCode = this.querySelect.proCode.selectList.find(d => d.Value === this.selectValue.proCode);
    const proName = this.querySelect.proName.selectList.find(d => d.Value === this.selectValue.proName);
    const modelName = this.querySelect.modelName.selectList.find(d => d.Value === this.selectValue.modelName);
    this.kanban = {
      plant: plant['PlantName'],
      custom: this.selectValue.custom,
      modelType: this.selectValue.modelType,
      proCode: proCode['Label'],
      proName: proName['Label'],
      modelName: modelName['Label'],
      cFlow: this.selectValue.cFlow.join()
    };
  }

  async query() {
    if (!this.selectValue.plant
      || !this.selectValue.custom
      || !this.selectValue.modelType
      || this.selectValue.proName.length === 0
      || !this.selectValue.modelName
      || this.selectValue.cFlow.length === 0) {
      this.message.create('error', this.trans['selectAll']);
      return;
    }
    if (this.timeFlag === 'b') {
      return;
    }
    this.kanbanShow();
    this.timeFlag = 'b';
    this.datas = await this.workhourQueryService.getTime(this.selectValue.modelName, this.selectValue.cFlow);
    this.datas.forEach(element => {
      element['time'].push(element['time'].reduce((a, b) => a + b));
      element['target'].push(element['target'].reduce((a, b) => a + b));
      if (element['Process'].findIndex(x => x === 'Total') < 0) {
        element['Process'].push('Total');
      }
    });
    const totledatas = this.getStage();
    await this.getOptionsFirst(totledatas);
    this.timeFlag = 'a';
  }

  getStage() {
    const totledatas = this.datas.reduce((p, t) => {
      p['stageID'].push(t['stageID']);
      p['Stage'].push(t['Stage']);
      p['time'].push(t['time']);
      p['target'].push(t['target']);
      p['Process'].push(t['Process']);
      return p;
    }, { 'stageID': [], 'Stage': [], 'time': [], 'target': [], 'Process': [] });
    return totledatas;
  }

  // echart點擊事件,傳值,跳轉,展示第二個頁面
  QueryDetail(stageID, process) {
    this.queryDetailStageID = stageID;
    this.queryDetailProcess = process;
    this.page = 'second';
  }

  onChartEvent(event: any, type: string) {
    if (event['seriesName'] === 'target') {
      return;
    }
    if (event.name === 'Total') {
      return;
    }
    this.target = this.optionsFirst['series'][event['seriesIndex']]['target'][event['dataIndex']];
    this.stageID = this.optionsFirst['series'][event['seriesIndex']]['stageID'];
    this.rfqID = this.datas[0]['rfqId'];
    this.proCodeID = this.selectValue.proCode;
    this.cFlow = event['seriesName'];
    this.process = event['name'];
    this.value = event['value'];
    this.QueryDetail(this.stageID, this.querySelect.Process.selectList.find(x => x.Label === this.process).Value);
  }

  getOptionsFirst(data) {
    this.dfcCommonService.getProcess(this.selectValue.plant, this.selectValue.modelType).pipe(
      map(
        (process: any) => {
          const allpro = [];
          Object.assign(allpro, this.querySelect.Process['selectList']);
          allpro.push({ Value: "Total", Label: 'Total' });
          const xside = [];
          if (process.length > 0) {
            process[0].processCode += ',Total';
            process[0].processCode.split(',').forEach(
              item => {
                const includeItem = allpro.find(
                  (findItem) => {
                    return findItem.Value === item;
                  }
                );
                if (includeItem) {
                  xside.push({ Label: includeItem.Label, Value: includeItem.Value });
                }
              }
            );
          } else {
            allpro.forEach(element => {
              xside.push({ Label: element.Label, Value: element.Value });
            });
          }
          let aaa = {};
          const ddd = [];
          xside.forEach(pro => {
            const bbb = [];
            for (let m = 0; m < data.Process.length; m++) {
              for (let n = 0; n < data.Process[0].length; n++) {
                if (pro.Value === data.Process[m][n]) {
                  aaa = {
                    process: pro.Value,
                    time: data.time[m][n],
                    target: data.target[m][n]
                  };
                  bbb.push(aaa);
                }
              }
            }
            ddd.push(bbb);
          });
          ddd.forEach(element => {
            if (element.length === 0) {
              element.push({ target: 0, time: 0 }, { target: 0, time: 0 }, { target: 0, time: 0 }, { target: 0, time: 0 },
                { target: 0, time: 0 }, { target: 0, time: 0 }, { target: 0, time: 0 }, { target: 0, time: 0 }, { target: 0, time: 0 }, { target: 0, time: 0 });
            }
          });
          for (let j = 0; j < data.Process.length; j++) {
            const newTime = [];
            const newTarget = [];
            ddd.forEach(d => {
              newTime.push(d[j].time);
              newTarget.push(d[j].target);
            });
            data.time[j] = newTime;
            data.target[j] = newTarget;
          }
          this.i = 1;
          this.FirstEchartParam.legendData = [];
          this.FirstEchartParam.series = [];
          const colorList = [
            'rgba(60, 144, 247, 1)', 'rgba(85, 191, 192, 1)', 'rgb(0, 102, 255)', 'rgb(34, 107, 218)', 'rgb(0, 69, 173)',
            'rgb(2, 50, 121)', 'rgb(44, 81, 138)', 'rgb(24, 54, 100)', 'rgb(115, 156, 218)', 'rgb(121, 124, 129)'
          ];
          this.FirstEchartParam.legendData = ['target'];
          this.FirstEchartParam.series[0] = {
            name: 'target',
            type: 'bar',
            itemStyle: {
              normal: {
                color: 'gold',
                label: {
                  show: true,
                  position: 'top',
                  formatter: function (p) {
                    return p.value.toFixed(2);
                  }
                }
              }
            },
            data: data.target[0]
          };
          data.Stage.forEach(tempData => {
            const index = this.i;
            this.FirstEchartParam.legendData.push(tempData);
            this.FirstEchartParam.series[index] = {
              stageID: data['stageID'][index - 1],
              proCodeID: tempData.proCodeID,
              name: tempData,
              target: data.target[0],
              type: 'bar',
              itemStyle: {
                normal: {
                  color: colorList[index],
                  label: {
                    show: true,
                    position: 'top',
                    formatter: function (p) {
                      return p.value.toFixed(2);
                    }
                  }
                }
              },
              data: data.time[index - 1]
            };
            this.i = this.i + 1;
          });
          data.Stage.unshift('target');
          this.optionsFirst = {
            tooltip: {
              trigger: 'item',
              backgroundColor: 'rgba(255,255,255,0.7)',
              textStyle: {
                color: 'black'
              },
              axisPointer: {
                type: 'shadow',
              },
              formatter: function (p) {
                return p.seriesName + ' ' + p.value.toFixed(2);
              }
            },
            legend: {
              x: 'center',
              y: 'bottom',
              data: data.Stage
            },
            calculable: true,
            grid: {
              x: '3%',
              y: '10%',
              x2: '3%',
              y2: '10%',
              containLabel: true
            },
            xAxis: [
              {
                axisLabel: {
                  show: true,
                  rotate: 315
                },
                type: 'category',
                data: xside.map(item => item.Label)
              }
            ],
            yAxis: [
              {
                type: 'value'
              }
            ],
            series: this.FirstEchartParam.series
          };
        }
      )
    ).subscribe();
  }

  // 撈全部的projectName
  searchProjectNameList(plant) {
    return this.dfcCommonService.getProjectName([plant], '', '', '', '', true).pipe(
      map(
        (res) => {
          this.tempProjectNameList = res;
        }
      )
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
