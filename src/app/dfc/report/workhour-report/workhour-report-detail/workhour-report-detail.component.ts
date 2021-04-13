import {
  Component,
  OnInit,
  Input
} from '@angular/core';
import {
  ClsDfcKpiSelect
} from '../workhour-report';
import { WorkhourReviewService } from '../../../model-effect/workhour-review/workhour-review.service'
import {
  StageApi, TargetOperationsApi, ProcessApi, StageInterface
} from '@service/dfc_sdk/sdk';
import { WorkhourService } from 'app/dfc/dfc-workhour.service';
import { DownexcelService } from '@service/downexcel.service';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-workhour-report-detail',
  templateUrl: './workhour-report-detail.component.html',
  styleUrls: ['./workhour-report-detail.component.scss']
})

export class WorkhourReportDetailComponent implements OnInit {
  _stageID;
  cFlow;
  tablePaging = true;
  projectName;
  processName;

  @Input() set stageID(stageID: string) {
    this._stageID = stageID;
    this.displayData();
  }
  get stageID(): string {
    return this._stageID;
  }
  @Input() process;
  @Input() tableHeight;
  // Echart
  chartData;
  MAX_BAR_NUM = 10;
  MAX_SIDE_BAR_NUM = 6;
  //  ----
  dl2;
  showAll = false;
  factors: Array<number>;
  dataSet = []; // 表格数据暂存
  nzNoResult = '無須改善項目'
  PlantMapping = JSON.parse(localStorage.getItem('DFC_PlantMapping'));
  dataWindowFlag = false;
  nzScroll: {} = {
    x: '1380px', y: '240px'
  };
  nzWidthConfig = [];
  nzWidthConfigs: any = {};

  // 下拉框传值
  plantSelectValue;
  selectValue: ClsDfcKpiSelect = {
    plant: '',
    custom: '',
    modelType: '',
    Process: '',
    proCode: [],
    proName: [],
    modelName: [],
    cFlow: [],
  };
  dataWindow;
  showLoading = false;
  processTarget: string; // 第二頁中 頁面上的 製程顯示
  dateFormat = 'yyyy/MM/dd'; // 日期格式显示
  // 表格
  listOfStatusSelectOption = [{
    Value: 0,
    Label: 'Open'
  },
  {
    Value: 1,
    Label: 'Ongoing'
  },
  {
    Value: 2,
    Label: 'Close'
  }
  ];

  searchFactorDetail = {
    rfq: '',
    target: '',
    actual: ''
  };
  trans = {};
  constructor(
    private workhourQueryService: WorkhourReviewService,
    private stageServer: StageApi,
    private workhourService: WorkhourService,
    private downExcelService: DownexcelService,
    private targetOperationsServer: TargetOperationsApi,
    private processApi: ProcessApi,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    // 初始化i18n;
    this.translate.get(['dashboard.workhour']).subscribe(res => {
      this.trans['workhour'] = res['dashboard.workhour'];
    });
    // 當點擊切換語言
    this.translate.onLangChange.pipe(takeUntil(new Subject())).subscribe(cur => {
      this.translate.get(['dashboard.workhour']).subscribe(res => {
        this.trans['workhour'] = res['dashboard.workhour'];
      });
    });
    this.nzWidthConfigs = {
      notdo: {
        nzWidthConfig: ['120px', '150px', '60px', '150px', '60px', '60px', '60px', '150px',
          '60px', '60px', '60px', '150px', '60px', '60px', '120px', '120px', '120px', '120px', '120px',
          '120px', '150px', '100px'
        ],
        nzScroll: {
          x: '2870px',
          y: this.tableHeight
        }
      }
    };
    this.nzWidthConfig = this.nzWidthConfigs.notdo.nzWidthConfig;
    this.nzScroll = this.nzWidthConfigs.notdo.nzScroll;
  }

  // 切換頁面
  clickSwitch() {
    this.nzWidthConfig = this.nzWidthConfigs.notdo.nzWidthConfig;
    this.nzScroll = this.nzWidthConfigs.notdo.nzScroll;
  }

  // 顯示細項
  showTableItem() {
    this.showAll = !this.showAll;
    this.searchFactorDetail.rfq = '';
    this.searchFactorDetail.target = '';
    this.searchFactorDetail.actual = '';
  }

  CreateNumberArray(i) {
    return Array(i).fill(1, 0, i).map((x, i) => i);
  }

  download() {
    this.tablePaging = false;
    const table = document.getElementById('downdata');
    setTimeout(() => {
      this.downExcelService.exportTableAsExcelFile(table, 'modelReview');
      this.tablePaging = true;
    }, 300);
  }

  SetChart(data) {
    const groupedFactorData = this.workhourService.GroupByFactor(data);
    const groupedMaterialData = this.workhourService.GroupByMaterialRFQ(groupedFactorData);
    const actural = this.workhourService.Sum(data['rfqOperations'].data.map(x => (x.CostTimeActural * x.Count)));
    const currentTarget = this.workhourService.Sum(data['stageOperations'].data.map(x => x.Count * x.CostTimeActural));
    const target = this.workhourService.Sum(data['rfqOperations'].data.map(x => { return x.TargetCount == null ? x.Count * x.CostTimeActural : x.TargetCount * x.CostTimeTarget }));
    const improvesTop5 = this.workhourService.LeftTops(groupedMaterialData['improves'], this.MAX_SIDE_BAR_NUM);
    const leftCount = this.MAX_BAR_NUM - improvesTop5.length;
    const gapsTop5 = this.workhourService.LeftTops(groupedMaterialData['gaps'], leftCount);
    this.chartData = {
      data: {
        groupedMaterialData: groupedMaterialData,
        acturalName: `RFQ ${this.trans['workhour']}`,
        actural: actural,
        aimsName: data.stageName + ` ${this.trans['workhour']}`,
        aims: currentTarget,
        targetName: 'Target',
        target: target,
        improvesTop5: improvesTop5,
        gapsTop5: gapsTop5
      }
    }
    return this.chartData;
  }

  async displayData() {
    const rawData = await this.queryDetailData();
    this.dataSet = this.workhourService.GroupByFactor(rawData);
    const chartData = this.SetChart(rawData);
    this.cFlow = rawData['stageName'];
    const improvesMaterialSeq: any[] = chartData.data.groupedMaterialData.improves.map(x => x.Material);
    const gapMaterialSeq = chartData.data.groupedMaterialData.gaps.map(x => x.Material);
    gapMaterialSeq.forEach(element => {
      if (improvesMaterialSeq.findIndex(x => x === element) < 0) {
        improvesMaterialSeq.push(element);
      }
    });
    this.factors = this.workhourService.CreateTableDataArray(this.dataSet, improvesMaterialSeq);
  }

  async queryDetailData() {
    const stages = await this.stageServer.findById(this.stageID, {
      include: {
        'basicModel':
          ['stages', { 'projectNameProfile': { 'projectCodeProfile': 'member' } }]
      }
    }
    ).toPromise<StageInterface>();
    this.projectName = stages.basicModel.modelName;
    const rfqStageId = stages.basicModel.stages.find(x => x.Stage === 'RFQ').StageID;
    this.dl2 = await this.workhourService.GetMOHDL(stages.basicModel.projectNameProfile.projectCodeProfile.ProjectCodeID);
    const result = await this.workhourQueryService.queryDetailDate(this.stageID, rfqStageId, this.process);
    this.processName = (await this.processApi.findById(this.process).toPromise())['Name'];
    result['stageName'] = stages['Stage'];
    return result;
  }

  // 展示全製程討論結果
  showComments(factorId) {
    this.targetOperationsServer.GetAllFactorComment(this.stageID, factorId).subscribe(res => {
      this.dataWindow = res;
      this.dataWindow.data = this.dataWindow.data.sort((a, b) => {
        return a.Stage > b.Stage ? 1 : -1;
      });
      for (let index = 0; index < this.dataWindow.data.length; index++) {
        const data = this.dataWindow.data[index];
        if (data.Stage === 'RFQ') {
          const aaa = data;
          this.dataWindow.data.splice(index, 1);
          this.dataWindow.data.unshift(aaa);
        }
      }
      this.dataWindowFlag = true;
    });
  }

  closeComments() {
    this.dataWindowFlag = false;
  }
}
