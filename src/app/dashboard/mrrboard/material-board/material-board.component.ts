import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IPieChartOption } from 'app/components/pie-chart/pie-chart';
import { Router } from '@angular/router';
import { PlantNamePipe } from 'app/shared/pipe/plantName/plant-name.pipe';
import { FactoryRecordApi } from '@service/mrr-sdk';
import { MaterialYieldRateKpi } from './mrrKpi';
@Component({
  selector: 'app-material-board',
  templateUrl: './material-board.component.html',
  styleUrls: ['./material-board.component.scss']
})
export class MaterialBoardComponent implements OnInit, OnChanges {

  @Input() bg: string;
  mrrKpiPlantCharts = []; // MRR材料良率追蹤餅圖
  mrrKpiPlantData;
  echartSummary = [];
  isLoading = false;
  PlantMapping = JSON.parse(localStorage.getItem('DFC_PlantMapping')) || [];
  constructor(
    private route: Router,
    private plantNamePipe: PlantNamePipe,
    private factoryRecord: FactoryRecordApi
  ) { }

  ngOnInit() {
  }

  // plantMapping filter bg plant
  ngOnChanges(changes: SimpleChanges) {
    const bgPlant = this.PlantMapping.reduce((p, t) => {
      if (!p[t['op']]) {
        p[t['op']] = [];
      }
      if (!p[t['op']].includes(t['Plant'])) {
        p[t['op']].push(t['Plant']);
      }
      if (!p['bgPlant'].includes(t['Plant'])) {
        p['bgPlant'].push(t['Plant']);
      }
      return p;
    }, { bgPlant: [] });
    let plants;
    if (changes['bg'].currentValue) {
      plants = bgPlant[changes['bg'].currentValue];
    } else {
      plants = bgPlant['bgPlant'];
    }
    this.getMrrPartNumberProcess(plants);
  }

  // MRR材料良率自動追蹤系統餅圖
  getMrrPartNumberProcess(plants) {
    this.isLoading = true;
    this.mrrKpiPlantCharts = [];
    const plantsCache = [];
    this.echartSummary = [];
    this.factoryRecord.getPie().subscribe(async (res: any) => {
      Object.assign(MaterialYieldRateKpi, res);
      this.mrrKpiPlantData = res.object;
      for (const key in this.mrrKpiPlantData) {
        if (Object.prototype.hasOwnProperty.call(this.mrrKpiPlantData, key)) {
          if (plants.includes(key)) {
            plantsCache.push(key);
          }
        }
      }
      for (let index = 0; index < plants.length; index++) {
        const Actived = this.PlantMapping.find(x => x.Plant === plants[index]).Actived;
        if (plantsCache.indexOf(plants[index]) !== -1) {
          const param = {
            titleText: plants[index],
            dataSecondName: this.mrrKpiPlantData[plants[index]].close,
            dataFourName: this.mrrKpiPlantData[plants[index]].total,
            dataTopValue: this.mrrKpiPlantData[plants[index]].close,
            dataMiddleValue: this.mrrKpiPlantData[plants[index]].ongoing,
            dataDownValue: this.mrrKpiPlantData[plants[index]].total - this.mrrKpiPlantData[plants[index]].close - this.mrrKpiPlantData[plants[index]].ongoing,
            Actived: Actived
          };
          this.mrrKpiPlantCharts.push(await this.getPieOption(param));
          // DFI月报MRR dashboard echart文字描述
          this.echartSummary.push({
            'title': plants[index],
            'top': this.mrrKpiPlantData[plants[index]].close,
            'total': this.mrrKpiPlantData[plants[index]].total
          });
        } else {
          const param = {
            titleText: plants[index],
            Actived: Actived
          };
          this.mrrKpiPlantCharts.push(await this.getPieOptionOpen(param));
          this.echartSummary.push({
            'title': plants[index],
            'top': 0,
            'total': 0
          });
        }
      }
      this.echartSummary = this.mergeArr(this.echartSummary);
      this.isLoading = false;
    }, error => {
      console.log(error.message);
      this.isLoading = false;
    });
  }

  // js数组对象的相同值相加合并
  mergeArr(arr) {
    const newArr = [];
    arr.forEach(item => {
      const dataItem = item;
      if (newArr.length > 0) {
        const filterValue = newArr.filter(v => {
          return v.title === dataItem.title;
        });
        if (filterValue.length > 0) {
          newArr.forEach(n => {
            if (n.title === filterValue[0].title) {
              n.top = filterValue[0].top + dataItem.top;
              n.total = filterValue[0].total + dataItem.total;
            }
          });
        } else {
          newArr.push(dataItem);
        }
      } else {
        newArr.push(dataItem);
      }
    });
    return newArr;
  }

  clickMrrKpi(event) {
    if (event.data.value) {
      this.route.navigate(['/dashboard/mrrMaterial/mrrKpi'], {
        queryParams: {
          plant: event.data.title
        }
      });
    }
  }

  async getPieOption(data: any): Promise<IPieChartOption> {
    const param: IPieChartOption = {
      title: await this.plantNamePipe.transform(data.titleText),
      subtext: (data.dataSecondName !== undefined ? data.dataSecondName : 'N/A') + '\n' + '─────' + '\n' + (data.dataFourName !== undefined ? data.dataFourName : 'N/A'),
      data: [
        {
          name: 'Top',
          value: data.dataTopValue,
          itemStyle: {
            color: data.dataTopValue === 0 ? 'rgba(248, 244, 244, 0.973)' : 'green'
          },
          title: data.titleText
        },
        {
          name: 'Middle',
          value: data.dataMiddleValue,
          itemStyle: {
            color: data.dataFourName === 0 ? 'rgba(248, 244, 244, 0.973)' : 'yellow'
          },
          title: data.titleText
        },
        {
          name: 'Down',
          value: data.dataDownValue,
          itemStyle: {
            color: data.dataFourName === 0 ? 'rgba(248, 244, 244, 0.973)' : 'red'
          },
          title: data.titleText
        }
      ],
      height: '160px',
      width: '160px'
    };
    return param;
  }

  // 未开发系统饼图绘制
  async getPieOptionOpen(data: any): Promise<IPieChartOption> {
    const param: IPieChartOption = {
      title: await this.plantNamePipe.transform(data.titleText),
      subtext: data.Actived ? '暫無數據' : '系統開發中',
      data: [{
        name: '暫無數據',
        value: 0,
        itemStyle: {
          color: 'rgba(248, 244, 244, 0.973)'
        }
      }],
      height: '160px',
      width: '160px'
    };
    return param;
  }
}
