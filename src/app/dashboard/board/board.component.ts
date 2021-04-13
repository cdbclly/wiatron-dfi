import { Component, OnInit } from '@angular/core';
import { ModelOperationTimeApi } from '@service/dfc_sdk/sdk';
import { Router } from '@angular/router';
import { View_ModelResultApi, V_PlantProjectApi } from '@service/mrr-sdk';
import { View_ModelResultApi as DFQModelResultApi } from './../../service/dfq_sdk/sdk/services/custom/View_ModelResult';
import { BusinessGroupApi, BusinessGroup } from '@service/dfi-sdk';
import { map, takeUntil } from 'rxjs/operators';
import { MeetingReviewTestService } from '../../dfq/exit-meeting/meeting-review-test/meeting-review-test.service';
import { IPieChartOption } from '../../components/pie-chart/pie-chart';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  bgChartOptions: {};
  plantDefaultOption: {};
  plantChartOptions = [];
  // 暂时用的DFC饼图设计
  bgChartOptions2: {};
  bgChartOptions2Flag = false;
  plantChartOptions2 = [];
  bgChartOptions3: {};
  bgChartOptions3Flag = false;
  plantChartOptions3 = [];

  PlantMapping = JSON.parse(localStorage.getItem('DFC_PlantMapping'));
  data = {};
  bgChartOptionsMRROP1: {};
  bgChartOptionsMRRCSBG: {};
  bgChartOptionsMRROP2: {};
  bgChartOptionsMRREBG: {};
  businessGroups: BusinessGroup[];
  dfcOptions = [];
  dfqOptions = [];
  mrrOptions = [];
  DfcBgPlantMapping = {};
  DfcBgPlantMappingTitle = [];
  DfcBgPlantMappingData = [];
  transNotice = {}
  constructor(
    private modelOperationTime: ModelOperationTimeApi,
    private route: Router,
    private viewService: View_ModelResultApi,
    private v_PlantProjectService: V_PlantProjectApi,
    private businessGroupService: BusinessGroupApi,
    private resultService: DFQModelResultApi,
    private meetingReviewService: MeetingReviewTestService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    // 初始化i18n;
    this.translate.get(['mrr.mrr-noData']).subscribe(res => {
      this.transNotice['noData'] = res['mrr.mrr-noData'];
    });
    // 當點擊切換語言
    this.translate.onLangChange.pipe(takeUntil(new Subject())).subscribe(cur => {
      this.translate.get(['mrr.mrr-noData']).subscribe(res => {
        this.transNotice['noData'] = res['mrr.mrr-noData'];
      });
    });
    this.businessGroupService.find<BusinessGroup>().subscribe(businessGroups => {
      this.businessGroups = businessGroups;
      this.getDfcBgPlantMapping();
      this.dfcBoard();
      this.dfqBoard();
      this.mrrBoard();
    });
  }

  // 得到廠別基本資料
  getDfcBgPlantMapping() {
    // 得到key
    this.PlantMapping.forEach(key => {
      if (this.DfcBgPlantMappingTitle.indexOf(key.op) === -1) {
        this.DfcBgPlantMappingTitle.push(key.op);
      }
    });
    // 得到value
    this.DfcBgPlantMappingTitle.forEach(key => {
      this.DfcBgPlantMappingData = [];
      this.PlantMapping.forEach(value => {
        this.DfcBgPlantMapping[key] = [];
        if (key === value.op) {
          this.DfcBgPlantMappingData.push(value.Plant);
        }
      });
      // 去除重複數據
      this.DfcBgPlantMappingData = Array.from(new Set(this.DfcBgPlantMappingData));
      this.DfcBgPlantMapping[key] = this.DfcBgPlantMappingData;
    });
  }

  dfcBoard() {
    this.modelOperationTime.GetOpTimeSummary().subscribe(res => {
      for (let index = 0; index < this.businessGroups.length; index++) {
        const bgPlants = this.DfcBgPlantMapping[this.businessGroups[index].id];
        let totalGoal = 0;
        let total = 0;
        const plants = Object.keys(res.result);
        plants.forEach(plant => {
          if (!!bgPlants && bgPlants.includes(plant)) {
            total += res.result[plant].total;
            totalGoal += res.result[plant].goal;
          }
        });
        if (total) {
          const bgParams = {
            businessGroup: this.businessGroups[index].id,
            dataTopValue: totalGoal,
            dataSecondName: totalGoal ? totalGoal : 0,
            dataFourName: total,
            dataDownValue: total - totalGoal
          };
          this.dfcOptions.push(this.getOptions(bgParams));
        } else {
          this.dfcOptions.push(this.getPieOptionOngoing({ businessGroup: this.businessGroups[index].id }));
        }
      }
    });
  }

  async dfqBoard() {
    for (let index = 0; index < this.businessGroups.length; index++) {
      await this.getBgNum(this.businessGroups[index].id).toPromise().then(res => {
        if (res.total) {
          this.dfqOptions.push(this.getOptions({
            businessGroup: this.businessGroups[index].id,
            dataTopValue: res.pass,
            dataSecondName: res.pass ? res.pass : 0,
            dataFourName: res.total,
            dataDownValue: res.total - res.pass
          }));
        } else {
          this.dfqOptions.push(this.getPieOptionOngoing({ businessGroup: this.businessGroups[index].id }));
        }
      });
    }
  }

  mrrBoard() {
    const list = [];
    this.businessGroups.forEach(bg => {
      list.push({ bg: bg.id, all: 0, finsh: 0 });
    });
    this.viewService.find().subscribe(res => {
      // 從v_PlantProjectA中撈取projectCode
      this.v_PlantProjectService.find({
        where: {
          and: [
            { moduleName: 'nudd' },
            { moduleEnabled: 1 },
          ]
        }
      }).subscribe(ree => {
        const proArr = [];
        ree.forEach(r => {
          proArr.push(r['projectCode']);
        });
        // 餅圖過濾掉closed掉nudd的機種
        res = res.filter(a => proArr.includes(a['project']));
        res.forEach(item => {
          list.forEach(l => {
            if (l.bg === item['businessGroup']) {
              if (item['status'] === 2) {
                l.all++;
                l.finsh++;
              } else {
                l.all++;
              }
            }
          });
        });
        list.forEach(item => {
          const option = {
            businessGroup: item.bg,
            dataTopValue: item.finsh,
            dataSecondName: item.finsh ? item.finsh : 0,
            dataFourName: item.all,
            dataDownValue: item.all - item.finsh
          };
          if (item.finsh === 0 && item.all === 0) {
            this.mrrOptions.push(this.getPieOptionOngoing(option));
          } else {
            this.mrrOptions.push(this.getOptions(option));
          }
        });
      });
    });
  }

  getOptions(data: any): IPieChartOption {
    const option: IPieChartOption = {
      title: data.businessGroup,
      subtext: (data.dataSecondName !== undefined ? data.dataSecondName : 'N/A') + '\n' + '─────' + '\n' + (data.dataFourName !== undefined ? data.dataFourName : 'N/A'),
      data: [
        {
          name: data.businessGroup,
          value: data.dataTopValue,
          itemStyle: {
            normal: {
              color: 'green'
            }
          }
        },
        {
          name: data.businessGroup,
          value: data.dataDownValue,
          itemStyle: {
            normal: {
              color: 'red'
            }
          }
        }
      ],
      width: '160px',
      height: '160px'
    };
    return option;
  }

  // 未开发系统饼图绘制
  getPieOptionOngoing(param: any): {} {
    const params: IPieChartOption = {
      title: param.businessGroup,
      subtext: this.transNotice['noData'],
      data: [{
        name: param.businessGroup,
        value: 0,
        itemStyle: {
          color: 'rgba(248, 244, 244, 0.973)'
        }
      }],
      width: '160px',
      height: '160px'
    };
    return params;
  }

  // echart点击跳轉
  linkDFQ(params) {
    this.route.navigate(['/dashboard/dfqboard/' + params.name]);
  }

  linkDFC(params) {
    this.route.navigate(['/dashboard/dfcboard/' + params.name]);
  }

  linkMRR(params) {
    this.route.navigate(['/dashboard/mrrboard/' + params.name]);
  }

  getBgNum(bg) {
    return this.resultService.find({
      where: {
        businessGroup: bg,
        signStatus: { inq: [4, 5] }
      }
    }).pipe(map(res => {
      const obj = { pass: 0, total: res.length };
      for (let index = 0; index < res.length; index++) {
        if (this.meetingReviewService.getResultByPlantId(res[index]['plant'], res[index]['status'])) {
          obj.pass++;
        }
      }
      return obj;
    }));
  }
}
