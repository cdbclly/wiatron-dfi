import { Component, Input, SimpleChanges, OnChanges } from '@angular/core';
import { NewModelDocumentApi } from '@service/mrr-sdk';
import { IPieChartOption } from 'app/components/pie-chart/pie-chart';
import { PlantNamePipe } from 'app/shared/pipe';
import { PlantApi } from '@service/dfi-sdk';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-document-board',
  templateUrl: './document-board.component.html',
  styleUrls: ['./document-board.component.scss']
})
export class DocumentBoardComponent implements OnChanges {
  @Input() bg: string;
  plants = [];
  BgPlantMapping = {};
  SitePlantMapping = [];
  options = [];
  c6Options = [];
  echartSummary = [];
  sitePlant;
  sitePlantC6;
  isLoading = false;
  transNotice = {};
  constructor(
    private router: Router,
    private newModelDocumentService: NewModelDocumentApi,
    private plantNamePipe: PlantNamePipe,
    private plantApi: PlantApi,
    private translate: TranslateService
  ) { }

  async ngOnChanges(changes: SimpleChanges) {
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
    this.isLoading = true;
    this.SitePlantMapping = await this.plantApi.find().toPromise();
    this.getBgPlants();
    const now = new Date();
    const lastYear = new Date();
    lastYear.setFullYear(now.getFullYear() - 1);
    // C3-C5資料
    const res = await this.newModelDocumentService
      .summary(
        this.bg ? this.BgPlantMapping[this.bg].toString() : this.plants.toString(),
        '',
        '',
        '',
        this.getDateFormat(lastYear),
        this.getDateFormat(now)
      )
      .toPromise();
    const data = {
      data: {
        C3: res.data.C3,
        C4: res.data.C4,
        C5: res.data.C5
      }
    };
    const optionData = this.getDocPipOption(this.bg, data);
    this.options = (await optionData).options;
    this.sitePlant = (await optionData).sitePlant;
    const C6data = {
      data: {
        C6: res.data.C6
      }
    };
    const optionDataC6 = this.getDocPipOption(this.bg, C6data);
    this.c6Options = (await optionDataC6).options;
    this.sitePlantC6 = (await optionDataC6).sitePlant;
    // 月報系統echarts title
    this.echartSummary = this.mergeArr(this.echartSummary);
    this.isLoading = false;
  }

  // 獲取plants,以及BgPlantMapping
  getBgPlants() {
    const map = new Map();
    const pmByPlant = this.SitePlantMapping.filter(p => !map.has(p.id) && map.set(p.id, 1));
    const pmByOp = this.SitePlantMapping.filter(p => !map.has(p.businessGroupId) && map.set(p.businessGroupId, 1));
    pmByPlant.forEach(e => {
      this.plants.push(e.id);
    });
    for (const item1 of pmByOp) {
      this.BgPlantMapping[`${item1.businessGroupId}`] = [];
      for (const item2 of pmByPlant) {
        if (item1.businessGroupId === item2.businessGroupId) {
          this.BgPlantMapping[`${item1.businessGroupId}`].push(item2.id);
        }
      }
    }
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

  // 時間格式改變
  private changeTime(data: number): string {
    let d: string;
    if (data < 10) {
      d = '0' + data;
    } else {
      d = data + '';
    }
    return d;
  }

  private getDateFormat(date): string {
    const changeDate = new Date(date);
    return changeDate.getFullYear() + '/' + this.changeTime(changeDate.getMonth() + 1) + '/' + this.changeTime(changeDate.getDate());
  }

  private async getDocPipOption(bgValue, res) {
    const siteData: any = {};
    const options = [];
    const sitePlant: any = {};
    const newMap = new Map();
    let BgPlantMapping;
    let plantMappings = this.SitePlantMapping;
    plantMappings = plantMappings.filter(p => !newMap.has(p.id) && newMap.set(p.id, 1));
    if (this.bg) {
      plantMappings = plantMappings.filter(a => a['businessGroupId'] === this.bg);
    }
    if (!res['data']) {
      if (bgValue) {
        BgPlantMapping = this.BgPlantMapping[bgValue];
      } else {
        BgPlantMapping = this.plants;
      }
      for (let index = 0; index < BgPlantMapping.length; index++) {
        const plantKey = BgPlantMapping[index];
        const plantMapping = this.SitePlantMapping.find(plantMap => plantMap['id'] === plantKey);
        if (!siteData[plantMapping['id']]) {
          siteData[plantMapping['id']] = {
            goal: 0,
            ungoal: 0
          };
        }
        if (!sitePlant[plantMapping['id']]) {
          sitePlant[plantMapping['id']] = [];
        }
        siteData[plantMapping['id']]['goal'] = 0;
        siteData[plantMapping['id']]['ungoal'] = 0;
        sitePlant[plantMapping['id']].push(plantMapping['siteId']);
      }
    } else {
      if (bgValue) {
        BgPlantMapping = this.BgPlantMapping[bgValue];
      } else {
        BgPlantMapping = this.plants;
      }
      for (const stageKey in res['data']) {
        if (res['data'].hasOwnProperty(stageKey)) {
          const stageData = res['data'][stageKey];
          for (let index = 0; index < BgPlantMapping.length; index++) {
            const plantKey = BgPlantMapping[index];
            const plantMapping = this.SitePlantMapping.find(plantMap => plantMap['id'] === plantKey);
            if (!siteData[plantKey]) {
              siteData[plantKey] = {
                goal: 0,
                ungoal: 0
              };
            }
            if (!sitePlant[plantKey]) {
              sitePlant[plantKey] = [];
            }
            if (stageData.hasOwnProperty(plantKey)) {
              const plantData = stageData[plantKey];
              siteData[plantKey]['goal'] += plantData['goal'].length;
              siteData[plantKey]['ungoal'] += plantData['ungoal'].length;
              sitePlant[plantKey].push(plantMapping['siteId']);
            } else {
              if (!siteData[plantMapping['id']]) {
                siteData[plantMapping['id']] = {
                  goal: 0,
                  ungoal: 0
                };
              }
              if (!sitePlant[plantMapping['id']]) {
                sitePlant[plantMapping['id']] = [];
              }
              siteData[plantMapping['id']]['goal'] = 0;
              siteData[plantMapping['id']]['ungoal'] = 0;
              sitePlant[plantMapping['id']].push(plantMapping['siteId']);
            }
          }
        }
      }
    }
    for (const key in siteData) {
      if (siteData.hasOwnProperty(key)) {
        const plantCode = siteData[key];
        const param = {
          titleText: key,
          dataTopValue: plantCode.goal,
          dataSecondName: plantCode.goal ? plantCode.goal : 0,
          dataFourName: plantCode.goal + plantCode.ungoal,
          dataDownValue: plantCode.ungoal
        };
        // DFI月报dashboard echart文字描述
        this.echartSummary.push({
          'title': await this.plantNamePipe.transform(key),
          'top': plantCode.goal ? plantCode.goal : 0,
          'total': plantCode.goal + plantCode.ungoal
        });
        let option;
        if (plantCode.goal === 0 && plantCode.ungoal === 0) {
          const active = plantMappings.find(ree => ree.id === key);
          if (active.enabled) {
            option = await this.getPieOptionOpen(param, this.transNotice['noData']);
          } else {
            option = await this.getPieOptionOpen(param, this.transNotice['sysDev']);
          }
        } else {
          option = await this.getPieOption(param);
        }
        options.push(option);
        options.sort(this.sortBySubtext);
      }
    }
    return { options: options, sitePlant: sitePlant };
  }

  // 按subtext排序
  sortBySubtext(a, b) {
    if (a['subtext'] > b['subtext']) {
      return 1;
    } else if (a['subtext'] < b['subtext']) {
      return -1;
    } else {
      return 0;
    }
  }

  async getPieOption(data: any): Promise<IPieChartOption> {
    const param = {
      title: await this.plantNamePipe.transform(data.titleText),
      subtext: (data.dataSecondName !== undefined ? data.dataSecondName : 'N/A') + '\n' + '─────' + '\n' + (data.dataFourName !== undefined ? data.dataFourName : 'N/A'),
      data: [
        {
          name: 'Top',
          value: data.dataTopValue,
          itemStyle: {
            color: 'green'
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
  async getPieOptionOpen(data: any, subTitle): Promise<IPieChartOption> {
    const param: IPieChartOption = {
      title: await this.plantNamePipe.transform(data.titleText),
      subtext: subTitle,
      data: [{
        name: this.transNotice['noData'],
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

  // 產品標準文件上傳  stage --- 標誌為是否為 C6
  onDocChartEvent(params: any, stage?: boolean) {
    if (['Top', 'Down'].includes(params.data['name'])) {
      const now = new Date();
      const lastYear = new Date();
      lastYear.setFullYear(now.getFullYear() - 1);
      this.router.navigate(['/dashboard/mrrDoc/report'], {
        queryParams: {
          plant: params.data.title,
          bu: this.bg,
          site: (stage
            ? this.sitePlantC6[params.data.title][0]
            : this.sitePlant[params.data.title][0]
          ),
          startTime: this.getDateFormat(lastYear),
          endTime: this.getDateFormat(now),
          stage: (stage ? ['C6'] : ['C3', 'C4', 'C5']).join()
        }
      });
    }
  }
}
