import { Component, OnInit, OnDestroy } from '@angular/core';
import { AbnormalBoardService } from './abnormal-board.service';
import { ToolkitService } from '../../imqm-common/service';
import { SelectItems } from '../../imqm-common/toolKits/model';
import { getSelectLocal } from '../../imqm-common/toolKits/autoSelect';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NzI18nService, zh_TW, en_US } from 'ng-zorro-antd';

@Component({
  selector: 'app-abnormal-board',
  templateUrl: './abnormal-board.component.html',
  styleUrls: ['./abnormal-board.component.scss']
})
export class AbnormalBoardComponent implements OnInit, OnDestroy {

  abnormalCountBarData;
  dataAlert;
  require = false;
  subFormsList;
  toolTip = [];
  subject = 'abnormal';
  selectItem: SelectItems;

  // i18n
  trans: Object = {};
  destroy$ = new Subject();

  constructor(
    private _service: AbnormalBoardService,
    private toolKits: ToolkitService,
    private translate: TranslateService,
    private nzI18nService: NzI18nService
    ) {
      this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(lang => {
        this.translate.get('imq-overSpec-count').subscribe(res => {
          this.trans['ovsCount'] = res;
          if (lang.lang === 'en') {
            this.nzI18nService.setLocale(en_US);
          } else {
            this.nzI18nService.setLocale(zh_TW);
          }
          this.ngOnInit();
        });
      });
    }

  ngOnInit() {
    this.translate.get('imq-overSpec-count').subscribe(res => {
      this.trans['ovsCount'] = res;
      const lastSelectItem = getSelectLocal(this.subject);
      if (lastSelectItem && lastSelectItem[this.subject]) {
        this.query(lastSelectItem[this.subject]);
      }
    });
  }

  async query(params) {
    console.log(params);
    this.selectItem = params;
    this._service.getAbnormalList(this.selectItem.cur_searchBy, {site: this.selectItem.cur_site, plant: this.selectItem.cur_plant, customer: this.selectItem.cur_customer, product: this.selectItem.cur_productCate,
      model: this.selectItem.cur_model === null ? undefined : this.selectItem.cur_model, vendor: this.selectItem.cur_vendor === null ? undefined : this.selectItem.cur_vendor,
      productName: this.selectItem.cur_proName === null ? undefined : this.selectItem.cur_proName, partNumber: this.selectItem.cur_materialNo === null ? undefined : this.selectItem.cur_materialNo
     }, Math.ceil(this.selectItem.date_from / 1000), Math.ceil(this.selectItem.date_to / 1000)).subscribe(async res => {
      this.abnormalCountBarData = await this.wrapAbnormalCountChart(res, this.trans['ovsCount'], [this.trans['ovsCount'], null], '100%');
     });
  }

  async wrapAbnormalCountChart(rawData, title, legend, char_width) {
    const data_x = Array(10).fill(''); let barData = {}; const data_y = []; const series = [];
    this.toolTip = []; let yrTarget;
    // 存放柱形图图顶的资料
    const abnormalTops = [];
    if (rawData) {
      // rawData.map((res, index) => {
    for (let i = 0; i < rawData.length; i++) {
        abnormalTops.push({value: rawData[i]['count'],
      itemStyle: {
        color: '#fb928e'
    }});
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
      const info = await this._service.getSelectInfoByPartNo(rawData[i]['name']);
      this.toolTip.push(res['info']);
      data_x[i] = rawData[i]['name'];
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
        const series_warning = {
          value: rawData[i]['count'],
          itemStyle: {
              color: {
                type: 'bar',
                colorStops: [{
                  offset: 0,
                  color: '#fe0c01',
                }, {
                  offset: 0.5,
                  color: '#fb928e'
                }, {
                  offset: 1,
                  color: '#fe0c01'
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
      // });
      }
    }
    const warning = {
      name: legend[0],
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
            color: '#fe0c01',
          }, {
            offset: 0.5,
            color: '#fb928e'
          }, {
            offset: 1,
            color: '#fe0c01'
          }],
          globalCoord: false
      }}
    };
    series.push(warning);
    series.push({
      name: '',
      type: 'pictorialBar',
      symbolSize: ['62%', 10],
      symbolOffset: [0, -5],
      symbolPosition: 'end',
      silent: true,
      data: abnormalTops,
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
    // const rawData = await this._service.getInitailData();
    // this.dataAlert = rawData['alertSubDetail'];
    if (this.selectItem.cur_searchBy === 'vendor') {
      this._service.getAbnormalForms(this.toolKits.assembleSelectObject(this.selectItem.cur_site, this.selectItem.cur_plant,
        this.selectItem.cur_productCate, this.selectItem.cur_customer, this.selectItem.cur_model, detail['name'], this.selectItem.cur_proName, this.selectItem.cur_materialNo),
      Math.ceil(this.selectItem.date_from / 1000), Math.ceil(this.selectItem.date_to / 1000)).subscribe(res => {
      this.dataAlert = res;
      // debugger
      console.log(res)

      this.dataAlert.forEach(element => {
        element['objName'] = 'abnormal';
        element['expand'] = false;
      });
    });
    }
    if (this.selectItem.cur_searchBy === 'model') {
      this._service.getAbnormalForms(this.toolKits.assembleSelectObject(this.selectItem.cur_site, this.selectItem.cur_plant,
        this.selectItem.cur_productCate, this.selectItem.cur_customer, detail['name'], this.selectItem.cur_vendor, this.selectItem.cur_proName, this.selectItem.cur_materialNo),
      Math.ceil(this.selectItem.date_from / 1000), Math.ceil(this.selectItem.date_to / 1000)).subscribe(res => {
      this.dataAlert = res;
      this.dataAlert.forEach(element => {
        element['objName'] = 'abnormal';
        element['expand'] = false;
      });
    });
    }
    if (this.selectItem.cur_searchBy === 'partNumber') {
      // debugger;
      this._service.getAbnormalForms(this.toolKits.assembleSelectObject(this.selectItem.cur_site, this.selectItem.cur_plant,
        this.selectItem.cur_productCate, this.selectItem.cur_customer, this.selectItem.cur_model, this.selectItem.cur_vendor, this.selectItem.cur_proName, this.toolTip[detail['dataIndex']][0]['partNumber']),
      Math.ceil(this.selectItem.date_from / 1000), Math.ceil(this.selectItem.date_to / 1000)).subscribe(res => {
      this.dataAlert = res;
      this.dataAlert.forEach(element => {
        element['objName'] = 'abnormal';
        element['expand'] = false;
      });
    });
    }
    if (this.selectItem.cur_searchBy === 'predefined') {
      this._service.getAbnormalForms(this.toolKits.assembleSelectObject(this.selectItem.cur_site, this.selectItem.cur_plant,
        this.selectItem.cur_productCate, this.selectItem.cur_customer, this.selectItem.cur_model, this.selectItem.cur_vendor, this.selectItem.cur_proName, this.toolTip[detail['dataIndex']]['partNumber']),
      Math.ceil(this.selectItem.date_from / 1000), Math.ceil(this.selectItem.date_to / 1000)).subscribe(res => {
      this.dataAlert = res;
      this.dataAlert.forEach(element => {
        element['objName'] = 'abnormal';
        element['expand'] = false;
      });
    });
    }
  }

  // 第三层放大镜点击最终获取到的第三层详细数据
  showFormDetail(form) {
    console.log(form);
    if (form['objName'] === 'abnormal') {
      // 根据 单号获取异常 列表数据
      this._service.getAbnormalRawDataBySN(form['number']).subscribe(result => {
        const res = result['rawData'];
        const tempData = JSON.parse(res[0]['rawData']);
        tempData['headerField'] = result['headerField'];
        this.subFormsList = {form: form, rawData: JSON.stringify(tempData), date: new Date().getTime()};
        console.log('第一层传到第三层的allData数据 \n', this.subFormsList);
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
 }

}
