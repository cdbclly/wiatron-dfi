import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IPieChartOption } from '../../../components/pie-chart/pie-chart';
import { PlantNamePipe } from 'app/shared/pipe';
import { MufrpiedataService } from 'app/dashboard/mrrboard/manufacturer-board/mufrpiedata.service';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-mufrpie',
  templateUrl: './mufrpie.component.html',
  styleUrls: ['./mufrpie.component.scss']
})
export class MufrpieComponent implements OnInit {
  pieChartDatas = [];
  stageId;
  bg;
  plantMapping = JSON.parse(localStorage.getItem('DFC_PlantMapping'));
  transNotice = {};
  constructor(
    private router: Router,
    public route: ActivatedRoute,
    private mufrpiedataService: MufrpiedataService,
    private plantNamePipe: PlantNamePipe,
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
    this.route.queryParams.subscribe(res => {
      this.stageId = res.stage;
      this.bg = res.bg;
      this.mufrpiedataService.getData(this.bg).then(data => {
        const classfiyData = this.mufrpiedataService.dealMufrDatas(data);
        this.getPieDataSet(classfiyData, this.stageId);
      });
    });
  }

  getPieDataSet(data, stage) {
    const dataSet = {};
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        // 删除第一层饼图用到的属性
        delete data[key]['totalPro'];
        delete data[key]['qualifiedPro'];
        delete data[key]['unqualifiedPro'];
        delete data[key]['generalPro'];
        if (key === stage) {
          Object.assign(dataSet, data[key]);
        }
      }
    }
    this.dealMufrDatas(dataSet);
  }

  async dealMufrDatas(data) {
    let plantMappings = JSON.parse(localStorage.getItem('DFC_PlantMapping'));
    if (this.bg) {
      plantMappings = plantMappings.filter(a => a['op'] === this.bg);
    }
    let param;
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const pieChart = [];
        const plantMapping = [];
        const plants = [];
        for (const key2 in data[key]) {
          if (data[key].hasOwnProperty(key2)) {
            let totalProNumber = 0;
            let passProNumber = 0;
            let failProNumber = 0;
            let generalProNumber = 0;
            plants.push(key2);
            for (const key3 in data[key][key2]) {
              if (data[key][key2].hasOwnProperty(key3)) {
                totalProNumber++;
                if (data[key][key2][key3]['status'] === 'green') {
                  passProNumber++;
                } else if (data[key][key2][key3]['status'] === 'red') {
                  failProNumber++;
                } else if (data[key][key2][key3]['status'] === 'yellow') {
                  generalProNumber++;
                }
              }
            }
            let plant;  // plantCode
            this.plantMapping.forEach(pm => {
              if (key2 === pm.PlantName) {
                if (pm.PlantCode === 'TBD1' || pm.PlantCode === 'TBD2' || pm.PlantCode === 'TBD3') {
                  plant = pm.PlantCode;
                } else {
                  plant = `F${pm.PlantCode}`;
                }
                return;
              } else if (key2 === pm.Site) {
                if (pm.PlantCode === 'TBD1' || pm.PlantCode === 'TBD2' || pm.PlantCode === 'TBD3') {
                  plant = pm.PlantCode;
                } else {
                  plant = `F${pm.PlantCode}`;
                }
                return;
              }
            });
            param = {
              titleText: await this.plantNamePipe.transform(plant),
              dataSecondName: passProNumber,
              dataFourName: totalProNumber,
              dataTopValue: passProNumber,
              dataMiddleValue: generalProNumber,
              dataDownValue: failProNumber,
              name: key2
            };
            pieChart.push(this.getPieOption(param));
          }
        }
        // 無資料的餅圖
        // 拿到沒有資料的plant
        plantMappings.forEach(item => {
          if (!(plants.includes(item.Site) || plants.includes(item.PlantName))) {
            plantMapping.push(item);
          }
        });
        let detailName;
        // 按PlantName去重
        const newSiteArry = [];
        for (let i = 0; i < plantMapping.length; i++) {
          let flag = true;
          const temp = plantMapping[i];
          for (let j = 0; j < newSiteArry.length; j++) {
            if (temp.PlantName === newSiteArry[j].PlantName) {
              flag = false;
              break;
            }
          }
          if (flag) {
            newSiteArry.push(temp);
          }
        }
        let plcd; // plantCode
        for (const item2 of newSiteArry) {
          if (item2.Actived) {
            detailName = this.transNotice['noData'];
          } else {
            detailName = this.transNotice['sysDev'];
          }
          if (item2.PlantCode === 'TBD1' || item2.PlantCode === 'TBD2' || item2.PlantCode === 'TBD3') {
            plcd = item2.PlantCode;
          } else {
            plcd = `F${item2.PlantCode}`;
          }
          param = {
            titleText: await this.plantNamePipe.transform(plcd),
            subTitle: detailName
          };
          pieChart.push(this.getPieOptionOpen(param));
        }
        const oneData = {
          producType: key,
          pieChart: pieChart
        };
        this.pieChartDatas.push(oneData);
      }
    }
  }

  getPieOption(data: any) {
    const param = {
      title: data.titleText,
      subtext: (data.dataSecondName !== undefined ? data.dataSecondName : 'N/A') + '\n' + '─────' + '\n' + (data.dataFourName !== undefined ? data.dataFourName : 'N/A'),
      plant: data.name,
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

  // 暫無數據餅圖
  // 未开发系统饼图绘制
  getPieOptionOpen(data: any): IPieChartOption {
    const param: IPieChartOption = {
      title: data.titleText,
      subtext: data.subTitle,
      data: [{
        name: data.subTitle,
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

  linkMufrList(data, option) {
    this.router.navigate(['/dashboard/mrrMdm/mufrpielist'],
      {
        queryParams: {
          bg: this.bg,
          stage: this.stageId,
          producType: data.producType,
          plant: option.plant
        }
      });
  }
}
