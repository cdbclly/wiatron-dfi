import { Component, OnInit, OnDestroy } from '@angular/core';
import { WarningBoardService } from './warning-board.service';
import { ToolkitService } from '../../imqm-common/service';
import { SelectItems } from '../../imqm-common/toolKits/model';
import { getSelectLocal } from '../../imqm-common/toolKits/autoSelect';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NzI18nService, en_US, zh_TW } from 'ng-zorro-antd';

@Component({
  selector: 'app-warning-board',
  templateUrl: './warning-board.component.html',
  styleUrls: ['./warning-board.component.scss']
})
export class WarningBoardComponent implements OnInit, OnDestroy {

  warningCountBarData: {};
  dataAlert;
  require = false;

  subFormsList;
  toolTip = [];
  subject = 'warning';
  selectItem: SelectItems;
  destroy$ = new Subject();

  // i18n
  preCount;

  constructor(
    private _service: WarningBoardService,
     private toolKits: ToolkitService,
     private translate: TranslateService,
     private nzI18nService: NzI18nService
     ) {
       this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe( cur => {
         this.translate.get('imq-preW-preCount').subscribe(res => {
           this.preCount = res;
           if (cur.lang === 'en') {
            this.nzI18nService.setLocale(en_US);
          } else {
            this.nzI18nService.setLocale(zh_TW);
          }
           this.ngOnInit();
         });
       });
      }

  ngOnInit() {
    this.translate.get('imq-preW-preCount').subscribe(res => {
      this.preCount = res;
      const lastSelectItem = getSelectLocal(this.subject);
      if (lastSelectItem && lastSelectItem[this.subject]) {
        this.query(lastSelectItem[this.subject]);
      }
    });
  }

  async query(params) {
    console.log(params);
    this.selectItem = params;
     this._service.getEarlyWarnList(this.selectItem.cur_searchBy, {site: this.selectItem.cur_site, plant: this.selectItem.cur_plant, customer: this.selectItem.cur_customer, product: this.selectItem.cur_productCate,
      model: this.selectItem.cur_model, vendor: this.selectItem.cur_vendor, productName: this.selectItem.cur_proName, partNumber: this.selectItem.cur_materialNo
     }, Math.ceil(this.selectItem.date_from / 1000), Math.ceil(this.selectItem.date_to / 1000)).subscribe(async res => {
       console.log(res);
      this.warningCountBarData = await this.warpWarningCountChart(res, this.preCount, [null, this.preCount], '100%');
    });
  }




  async warpWarningCountChart(rawData, title, legend, char_width) {
    const data_x = Array(10).fill(''); let barData = {}; const data_y = []; const series = [];
    let yrTarget;
    const alertTops = []; // 存放柱形图图顶的资料
    this.toolTip = [];
    if (rawData) {
      // data_x = rawData['dataX'];
      // debugger;
      // rawData.map(async (res, index) => {
      for (let i = 0; i < rawData.length; i++) {
        const res = rawData[i];
        const yrTargetDef = await this._service.getYrTarget(this.selectItem.cur_site, this.selectItem.cur_plant, '*', '*');
        if (this.selectItem.cur_searchBy === 'model') {
          yrTarget = await this._service.getYrTarget(this.selectItem.cur_site, this.selectItem.cur_plant, res['key'], '*');
        }
        if (this.selectItem.cur_searchBy === 'partNumber') {
         yrTarget = await this._service.getYrTarget(this.selectItem.cur_site, this.selectItem.cur_plant, this.selectItem.cur_model ? this.selectItem.cur_model : '*', res['key']);
        }
        if (this.selectItem.cur_searchBy === 'vendor') {
         yrTarget = await this._service.getYrTarget(this.selectItem.cur_site, this.selectItem.cur_plant, '*', '*');
        }



        if (this.selectItem.cur_searchBy === 'predefined') {
          // 如果只选了品名
          if (this.selectItem.cur_proName && !this.selectItem.cur_vendor && !this.selectItem.cur_model && !this.selectItem.cur_materialNo) {
            yrTarget = await this._service.getYrTarget(this.selectItem.cur_site, this.selectItem.cur_plant, this.selectItem.cur_model ? this.selectItem.cur_model : '*', res['key']);
          } else if (this.selectItem.cur_materialNo) { // 选择了料号
            yrTarget = await this._service.getYrTarget(this.selectItem.cur_site, this.selectItem.cur_plant, this.selectItem.cur_model ? this.selectItem.cur_model : '*', res['key']);
          } else if (this.selectItem.cur_model) { // 选择机种
            yrTarget = await this._service.getYrTarget(this.selectItem.cur_site, this.selectItem.cur_plant, res['key'], '*');
          } else if (this.selectItem.cur_vendor) { // 选择供应商
            yrTarget = await this._service.getYrTarget(this.selectItem.cur_site, this.selectItem.cur_plant, '*', '*');
          }
        }


        res['target'] = yrTarget.length > 0 ? yrTarget[0]['yrTarget'] : yrTargetDef.length > 0 ? yrTargetDef[0]['yrTarget'] : undefined;
        res['percent'] = parseFloat(res['percent']);


        if (this.selectItem.cur_searchBy === 'predefined') {
          this.toolTip.push(res['info']);
          if (rawData[i]['name'].includes('.') && data_x[i].split('.').length === 3) {
            data_x[i] = data_x[i].split('.');
            data_x[i].splice(0, 1);
            data_x[i] = data_x[i].join(',');
            data_x[i] = data_x[i].replace(',', '.');
          } else {
            data_x[i] = rawData[i]['name'];
          }
        } else if (this.selectItem.cur_searchBy === 'partNumber') {
          // const info = await this._service.getSelectInfoByPartNo(rawData[i]['name']);
          this.toolTip.push(res['info']);
          if (rawData[i]['name'].includes('.') && data_x[i].split('.').length === 3) {
            data_x[i] = data_x[i].split('.');
            data_x[i].splice(0, 1);
            data_x[i] = data_x[i].join(',');
            data_x[i] = data_x[i].replace(',', '.');
          } else {
            data_x[i] = rawData[i]['name'];
          }
        } else {
          data_x[i] = rawData[i]['name'];
        }
        alertTops.push({value: rawData[i]['count'],
      itemStyle: {
        normal: {
          color: '#FFC409'
        }
      }});
        const series_warning = {
          value: rawData[i]['count'],
          itemStyle: {
            color: {
              type: 'bar',
              colorStops: [{
                offset: 0,
                color: '#DEA900',
              }, {
                offset: 0.5,
                color: '#FFC409'
              }, {
                offset: 1,
                color: '#DEA900'
              }],
              globalCoord: false
            }
          },
          label: {
            show: rawData[i]['count'] !== 0 ? true : false,
            position: 'inside',
            fontSize: 12,
            color: 'white'
           }
        };
        data_y.push(series_warning);
      }
      // });
    }
    const warning = {
      name: legend[1],
      type: 'bar',
      data: data_y,
      barWidth: '50%',
      z: 12,
      tooltip : {
        backgroundColor: 'rgba(255,255,255,0.7)',
        textStyle: {
          color: 'black'
      }
      },
      itemStyle: {
        color: {
          type: 'bar',
          colorStops: [{
            offset: 0,
            color: '#DEA900',
          }, {
            offset: 0.5,
            color: '#FFC409'
          }, {
            offset: 1,
            color: '#DEA900'
          }],
         globalCoord: false
      }}
    };
    // debugger;
    series.push(warning);
    series.push({
      name: '',
      type: 'pictorialBar',
      symbolSize: ['62%', 10],
      symbolOffset: [0, -5],
      symbolPosition: 'end',
      silent: true,
      data: alertTops,
      tooltip: {
        showContent: false
      }
  });
    barData = {
      data_x: data_x,
      title: title,
      legend: legend,
      width: char_width,
      height: '14vw',
      series: series,
      toolTip: this.toolTip
    };
    return barData;
  }

  async showSubDetailAlert(detail) {
    console.log(detail);
    // 根据vender：供应商、model：机种、partNumber：料号区分数据
    if (this.selectItem.cur_searchBy === 'vendor') {
      this._service.getEarlyWarnForms(this.toolKits.assembleSelectObject(this.selectItem.cur_site, this.selectItem.cur_plant,
        this.selectItem.cur_productCate, this.selectItem.cur_customer, this.selectItem.cur_model, detail['name'], this.selectItem.cur_proName, this.selectItem.cur_materialNo),
      Math.ceil(this.selectItem.date_from / 1000), Math.ceil(this.selectItem.date_to / 1000)).subscribe(res => {
      this.dataAlert = res;
      this.dataAlert.forEach(element => {
        element['objName'] = 'earlyWarn';
        element['expand'] = false;
      });
    });
    }
    if (this.selectItem.cur_searchBy === 'model') {
      this._service.getEarlyWarnForms(this.toolKits.assembleSelectObject(this.selectItem.cur_site, this.selectItem.cur_plant,
        this.selectItem.cur_productCate, this.selectItem.cur_customer, detail['name'], this.selectItem.cur_vendor, this.selectItem.cur_proName, this.selectItem.cur_materialNo),
      Math.ceil(this.selectItem.date_from / 1000), Math.ceil(this.selectItem.date_to / 1000)).subscribe(res => {
      this.dataAlert = res;
      this.dataAlert.forEach(element => {
        element['objName'] = 'earlyWarn';
        element['expand'] = false;
      });
    });
    }
    if (this.selectItem.cur_searchBy === 'partNumber') {
      this._service.getEarlyWarnForms(this.toolKits.assembleSelectObject(this.selectItem.cur_site, this.selectItem.cur_plant,
        this.selectItem.cur_productCate, this.selectItem.cur_customer, this.selectItem.cur_model, this.selectItem.cur_vendor, this.selectItem.cur_proName, this.toolTip[detail['dataIndex']]['partNumber']),
      Math.ceil(this.selectItem.date_from / 1000), Math.ceil(this.selectItem.date_to / 1000)).subscribe(res => {
      this.dataAlert = res;
      this.dataAlert.forEach(element => {
        element['objName'] = 'earlyWarn';
        element['expand'] = false;
      });
    });
    }
    if (this.selectItem.cur_searchBy === 'predefined') {
      // 新增筛选判断
      this._service.getEarlyWarnForms(this.toolKits.assembleSelectObject(this.selectItem.cur_site, this.selectItem.cur_plant,
        this.selectItem.cur_productCate, this.selectItem.cur_customer, this.selectItem.cur_model, this.selectItem.cur_vendor, this.selectItem.cur_proName, this.toolTip[detail['dataIndex']]['partNumber']),
      Math.ceil(this.selectItem.date_from / 1000), Math.ceil(this.selectItem.date_to / 1000)).subscribe(res => {
      this.dataAlert = res;
      this.dataAlert.forEach(element => {
        element['objName'] = 'earlyWarn';
        element['expand'] = false;
      });
    });
    }
  }

  showFormDetail(form) {
    console.log(form);
    if (form['objName'] === 'earlyWarn') {
      this._service.getEarlyWarnRawDataBySN(form['number']).subscribe(res => {
        this.subFormsList = {form: form, rawData: res[0]['rawData'], date: new Date().getTime()};

        console.log('this.subFormsList = \n', this.subFormsList);

      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
 }
}
