import {
  Component,
  OnInit
} from '@angular/core';
import {
  MOHApi, ModelOperationTimeApi
} from '@service/dfc_sdk/sdk';
import { ActivatedRoute, Router } from '@angular/router';
import { IPieChartOption } from '../../components/pie-chart/pie-chart';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-dfcboard',
  templateUrl: './dfcboard.component.html',
  styleUrls: ['./dfcboard.component.scss']
})
export class DfcboardComponent implements OnInit {
  datadown = {};
  datatop = {};
  bg: string;
  chartOptionsPhase1 = [];
  chartOptionsPhase2 = [];
  DfcBgPlantMapping = {};
  DfcBgPlantMappingTitle = [];
  DfcBgPlantMappingData = [];
  PlantMapping = JSON.parse(localStorage.getItem('DFC_PlantMapping'));
  transNotice = {};
  constructor(
    private mohService: MOHApi,
    private route: Router,
    private router: ActivatedRoute,
    private modelOperationTime: ModelOperationTimeApi,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    // 初始化i18n;
    this.translate.get(['mrr.mrr-noData', 'mrr.mrr-sysDev']).subscribe(res => {
      this.transNotice['noData'] = res['mrr.mrr-noData'];
      this.transNotice['sysDev'] = res['mrr.mrr-sysDev'];
    });
    // 當點擊切換語言
    this.translate.onLangChange.pipe(takeUntil(new Subject())).subscribe(cur => {
      this.translate.get(['mrr.mrr-noData', 'mrr.mrr-sysDev']).subscribe(res => {
        this.transNotice['noData'] = res['mrr.mrr-noData'];
        this.transNotice['sysDev'] = res['mrr.mrr-sysDev'];
      });
    });
    this.router.paramMap.subscribe(res => {
      this.bg = res.get('bg');
      this.getDfcBgPlantMapping();
      this.InitDfcChart();
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

  InitDfcChart() {
    //  上chart圖
    this.mohService.GetSummary().subscribe(result => {
      this.datatop = result.data;
      const bgPlants = this.DfcBgPlantMapping[this.bg];
      for (let i = 0; i < bgPlants.length; i++) {
        const plant = bgPlants[i];
        const plantMapping = this.PlantMapping.find(plantMap => plantMap['Plant'] === plant);
        const Actived = this.PlantMapping.find(plantMap => plantMap['Plant'] === plant)['Actived'];
        let param: IPieChartOption;
        if (result.data[plant]) {
          param = {
            title: (!plantMapping) ? plant : plantMapping['PlantName'],
            subtext: (result.data[plant].goal !== undefined ? result.data[plant].goal : 'NA') + '\n────\n' + (result.data[plant].total !== undefined ? result.data[plant].total : 'NA'),
            data: [{
              name: 'Top',
              value: result.data[plant].total,
              itemStyle: {
                color: 'green',
              },
              plantName: (!plantMapping) ? plant : plantMapping['PlantName']
            },
            {
              name: 'Down',
              value: result.data[plant].total - result.data[plant].goal,
              itemStyle: {
                color: 'red',
              },
              plantName: (!plantMapping) ? plant : plantMapping['PlantName']
            }],
            height: '160px',
            width: '160px'
          };
          this.chartOptionsPhase1.push(param);
        } else {
          param = {
            title: (!plantMapping) ? plant : plantMapping['PlantName'],
            subtext: (Actived) ? this.transNotice['noData'] : this.transNotice['sysDev'],
            data: [{
              name: (Actived) ? this.transNotice['noData'] : this.transNotice['sysDev'],
              value: 0,
              itemStyle: {
                color: 'rgba(248, 244, 244, 0.973)'
              }
            }],
            height: '160px',
            width: '160px'
          };
          this.chartOptionsPhase1.push(param);
        }
      }
    });
    // 獲取成效追蹤 pip
    //  下chart圖
    this.modelOperationTime.GetOpTimeSummary().subscribe(datas => {
      this.datadown = datas.result;
      const bgPlants = this.DfcBgPlantMapping[this.bg];
      bgPlants.forEach(plant => {
        const plantMapping = this.PlantMapping.find(plantMap => plantMap['Plant'] === plant);
        const Actived = this.PlantMapping.find(plantMap => plantMap['Plant'] === plant)['Actived'];
        let param: IPieChartOption;
        if (datas.result[plant]) {
          param = {
            title: (!plantMapping) ? plant : plantMapping['PlantName'],
            subtext: (datas.result[plant].goal !== undefined ? datas.result[plant].goal : 'NA') + '\n────\n' + (datas.result[plant].total !== undefined ? datas.result[plant].total : 'NA'),
            data: [{
              name: 'Top',
              value: datas.result[plant].total,
              itemStyle: {
                color: 'green'
              },
              plantName: (!plantMapping) ? plant : plantMapping['PlantName']
            },
            {
              name: 'Down',
              value: datas.result[plant].total - datas.result[plant].goal,
              itemStyle: {
                color: 'red',
              },
              plantName: (!plantMapping) ? plant : plantMapping['PlantName']
            }],
            height: '160px',
            width: '160px'
          };
          this.chartOptionsPhase2.push(param);
        } else {
          param = {
            title: (!plantMapping) ? plant : plantMapping['PlantName'],
            subtext: (Actived) ? this.transNotice['noData'] : this.transNotice['sysDev'],
            data: [{
              name: (Actived) ? this.transNotice['noData'] : this.transNotice['sysDev'],
              value: 0,
              itemStyle: {
                color: 'rgba(248, 244, 244, 0.973)'
              }
            }],
            height: '160px',
            width: '160px'
          };
          // 下chart圖 賦值
          this.chartOptionsPhase2.push(param);
        }
      });
    });
  }

  // echart 点击事件, flag--> true  機種成效追蹤
  onChartEvent(params: any, flag?: boolean) {
    if (flag) {
      if (params.name !== 'Top' && params.name !== 'Down') {
        return;
      }
      const plantMap = this.PlantMapping.find(plantMapping => plantMapping['PlantName'] === params.data.plantName);
      let projectNameId = '';
      if (params.name === 'Top') {
        projectNameId = this.datadown[plantMap['Plant']].goalProjectNameID.toString();
        this.route.navigate(['/dashboard/dfc/dfc-kpi/' + plantMap['Plant'] + '/' + projectNameId + '/' + params.name]);
      } else {
        projectNameId = this.datadown[plantMap['Plant']].ungoalProjectNameID.toString();
        this.route.navigate(['/dashboard/dfc/dfc-kpi/' + plantMap['Plant'] + '/' + projectNameId + '/' + params.name]);
      }
    } else {
      if (params.name !== 'Top' && params.name !== 'Down') {
        return;
      }
      const plantMap = this.PlantMapping.find(plantMapping => plantMapping['PlantName'] === params.data.plantName);
      let projectCodeId = '';
      if (params.name === 'Top') {
        projectCodeId = this.datatop[plantMap['Plant']].goalProjectCodeID.toString();
      } else {
        projectCodeId = this.datatop[plantMap['Plant']].ungoalProjectCodeID.toString();
      }
      this.route.navigate(['/dashboard/dfc/model-workhour'], {
        queryParams: {
          dashboardFlag: true,
          plant: plantMap['Plant'],
          projectCodeId: projectCodeId,
          type: params.name
        }
      });
    }
  }
}
