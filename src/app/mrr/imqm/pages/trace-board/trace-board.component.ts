import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TraceBoardService } from './trace-board.service';
import { SelectItems } from '../../imqm-common/toolKits/model';
import { getSelectLocal } from '../../imqm-common/toolKits/autoSelect';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NzI18nService, en_US, zh_TW } from 'ng-zorro-antd';

@Component({
  selector: 'app-trace-board',
  templateUrl: './trace-board.component.html',
  styleUrls: ['./trace-board.component.scss']
})

export class TraceBoardComponent implements OnInit, OnDestroy {

  // 傳送進來的原始資料
  materialNGRawData: any[] = []; // PD材料NG追溯
  // Chart上會需要的資料
  materialNGBarData: {}; // PD材料NG追溯 echart

  materialProductTraceLineData: {};

  // 彈出視窗相關變數
  dataNg;

  // 二階彈出框
  subFormsList;

  // 篩選相關變數
  filterData;

  toolTip = [];

  require = false;
  subject = 'traceBack';
  selectItem: SelectItems;

  // i18n
  destroy$ = new Subject();
  trans: Object = {};

  constructor(private route: ActivatedRoute,
    private service: TraceBoardService,
    private translate: TranslateService,
    private nzI18nService: NzI18nService
    ) {
      this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(lang => {
        this.translate.get('imq-trace-ngMaterial').subscribe(res => {
          this.trans['ngMaterial'] = res;
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
    this.translate.get('imq-trace-ngMaterial').subscribe(res => {
      this.trans['ngMaterial'] = res;
      const lastSelectItem = getSelectLocal(this.subject);
      if (lastSelectItem && lastSelectItem[this.subject]) {
        this.query(lastSelectItem[this.subject]);
      }
    });
  }

  async query(params) {
    console.log(params);
    this.selectItem = params;
    // 根據的params獲取raw data
    this.service.getTraceListByGroup(this.selectItem.cur_searchBy, this.selectItem.cur_site, this.selectItem.cur_plant,
      this.selectItem.cur_productCate, this.selectItem.cur_customer, this.selectItem.cur_model, this.selectItem.cur_vendor, this.selectItem.cur_proName,
      this.selectItem.cur_materialNo, this.selectItem.date_from, this.selectItem.date_to).subscribe( async res => {
      console.log(res);
      this.materialNGBarData = await this.wrapmaterialNGChar(res, this.trans['ngMaterial'], ['close', 'ongoing', 'open'], '100%');
    });
  }

  // 顯示首頁PD材料PD追溯
  async wrapmaterialNGChar(rowData, title, legend_name, char_width) {
    const dataX = Array(10).fill(''); const dataNg = []; const close = []; const onGoing = []; const open = [];
    let yrTarget;
    const data_arr = []; // 总数
    const data_close = []; // close的数量
    const data_onGoing = [];
    this.toolTip = [];
    // 設定chart的資料
    // debugger;
    for (let i = 0; i < rowData.length; i++) {
      const res = rowData[i];
      const yrTargetDef = await this.service.getYrTarget(this.selectItem.cur_site, this.selectItem.cur_plant, '*', '*');
      if (this.selectItem.cur_searchBy === 'model') {
        yrTarget = await this.service.getYrTarget(this.selectItem.cur_site, this.selectItem.cur_plant, res['key'], '*');
       }
      if (this.selectItem.cur_searchBy === 'partNumber') {
       yrTarget = await this.service.getYrTarget(this.selectItem.cur_site, this.selectItem.cur_plant, this.selectItem.cur_model ? this.selectItem.cur_model : '*', res['key']);
      }
      if (this.selectItem.cur_searchBy === 'vendor') {
       yrTarget = await this.service.getYrTarget(this.selectItem.cur_site, this.selectItem.cur_plant, '*', '*');
      }

      if (this.selectItem.cur_searchBy === 'predefined') {
        // 如果只选了品名
        if (this.selectItem.cur_proName && !this.selectItem.cur_vendor && !this.selectItem.cur_model && !this.selectItem.cur_materialNo) {
          yrTarget = await this.service.getYrTarget(this.selectItem.cur_site, this.selectItem.cur_plant, this.selectItem.cur_model ? this.selectItem.cur_model : '*', res['key']);
        } else if (this.selectItem.cur_materialNo) { // 选择了料号
          yrTarget = await this.service.getYrTarget(this.selectItem.cur_site, this.selectItem.cur_plant, this.selectItem.cur_model ? this.selectItem.cur_model : '*', res['key']);
        } else if (this.selectItem.cur_model) { // 选择机种
          yrTarget = await this.service.getYrTarget(this.selectItem.cur_site, this.selectItem.cur_plant, res['key'], '*');
        } else if (this.selectItem.cur_vendor) { // 选择供应商
          yrTarget = await this.service.getYrTarget(this.selectItem.cur_site, this.selectItem.cur_plant, '*', '*');
        }
      }
      res['target'] = yrTarget.length > 0 ? yrTarget[0]['yrTarget'] : yrTargetDef.length > 0 ? yrTargetDef[0]['yrTarget'] : undefined;
      res['percent'] = parseFloat(res['percent']);
      if (this.selectItem.cur_searchBy === 'predefined') {
        this.toolTip.push(res['info']);
        // dataX[i] = rowData[i]['name'];
        if (rowData[i]['name'].includes('.') && dataX[i].split('.').length === 3) {
          dataX[i] = dataX[i].split('.');
          dataX[i].splice(0, 1);
          dataX[i] = dataX[i].join(',');
          dataX[i] = dataX[i].replace(',', '.');
        } else {
          dataX[i] = rowData[i]['name'];
        }
      } else if (this.selectItem.cur_searchBy === 'partNumber') {
        // const info = await this.service.getSelectInfoByPartNo(rowData[i]['name']);
        this.toolTip.push(res['info']);
        dataX[i] = rowData[i]['name'];
        if (rowData[i]['name'].includes('.') && dataX[i].split('.').length === 3) {
          dataX[i] = dataX[i].split('.');
          dataX[i].splice(0, 1);
          dataX[i] = dataX[i].join(',');
          dataX[i] = dataX[i].replace(',', '.');
        } else {
          dataX[i] = rowData[i]['name'];
        }
      } else {
        dataX[i] = rowData[i]['name'];
      }
       data_arr.push({value: rowData[i]['close'] + rowData[i]['ongoing'] + rowData[i]['open'], itemStyle: {color:
        rowData[i]['open'] !== 0 ? '#fb928e' : rowData[i]['ongoing'] !== 0 ? '#FFC409' : '#60d26e'
      }});
      if (rowData[i]['close'] !== 0 && rowData[i]['ongoing'] !== 0) {
        data_close.push({value: rowData[i]['close'], itemStyle: {color: '#FFC409'}});
      }
      if (rowData[i]['ongoing'] !== 0 && rowData[i]['open'] !== 0) {
        data_onGoing.push({value: rowData[i]['close'] + rowData[i]['ongoing'], itemStyle: {
    color: '#fb928e'
        }});
      }
       close.push({value: rowData[i]['close'],label: {
         show: rowData[i]['close'] !== 0 ? true : false,
         position: 'inside',
         fontSize: 12,
         color: 'white'
        } });
       onGoing.push({value: rowData[i]['ongoing'], label: {show: rowData[i]['ongoing'] !== 0 ? true : false,
       position: 'inside',
       fontSize: 12,
       color: 'white'
      }});
       open.push({value: rowData[i]['open'], label: {show: rowData[i]['open'] !== 0 ? true : false,
       position: 'inside',
       fontSize: 12,
       color: 'white'
      }});
    }

     const seriesClose = {
       name: 'close',
       type: 'bar',
       stack: 'PDNG',
       barWidth: '50%',
       z: 12,
      itemStyle: {
        color: {
          type: 'bar',
          colorStops: [{
            offset: 0,
            color: '#038113',
          }, {
            offset: 0.5,
            color: '#60d26e'
          }, {
            offset: 1,
            color: '#038113'
          }],
          globalCoord: false
        }
      },
       data: close,
       tooltip : {
        backgroundColor: 'rgba(255,255,255,1)',
        textStyle: {
          color: 'black'
      }
      }
     };
     const seriesOngoing = {
       name: 'ongoing',
       type: 'bar',
       stack: 'PDNG',
       barWidth: '50%',
       z: 12,
      itemStyle: {
        color: {
          type: 'bar',
          colorStops: [{
            offset: 0,
            color: '#DEA900'
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
      data: onGoing,
      tooltip : {
        backgroundColor: 'rgba(255,255,255,1)',
        textStyle: {
          color: 'black'
      }
      }
     };
     const seriesOpen = {
       name: 'open',
       type: 'bar',
       stack: 'PDNG',
       barWidth: '50%',
       z: 12,
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
      data: open,
      tooltip : {
        backgroundColor: 'rgba(255,255,255,1)',
        textStyle: {
          color: 'black'
      }
      }
     };
     dataNg.push(seriesClose);
     dataNg.push(seriesOngoing);
     dataNg.push(seriesOpen);
     dataNg.push(
      {
        name: '',
        type: 'pictorialBar',
        stack: 'PDNG',
        symbolSize: ['62%', 10],
        symbolOffset: [0, -5],
        symbolPosition: 'end',
        silent: true,
        label: {
          show: false,
          position: 'top',
          formatter: '{c}%'
        },
        data: data_arr,
        tooltip: {
          showContent: false
        }
      }
    );
    dataNg.push(
      {
        name: '',
        type: 'pictorialBar',
        tooltip: {
          showContent: false
        },
        stack: 'PDNG',
        symbolSize: ['62%', 10],
        symbolOffset: [0, -5],
        symbolPosition: 'end',
        silent: true,
        label: {
          show: false,
          position: 'top',
          formatter: '{c}%'
        },
        data: data_close
      }
    );
    dataNg.push(
      {
        name: '',
        type: 'pictorialBar',
        stack: 'PDNG',
        symbolSize: ['62%', 10],
        symbolOffset: [0, -5],
        symbolPosition: 'end',
        silent: true,
        label: {
          show: false,
          position: 'top',
          formatter: '{c}%'
        },
        data: data_onGoing,
        tooltip: {
          showContent: false
        }
      }
    );

     // 將設定好的資料填入chart的資料物件
     const barData = {
       title: title,
       legend: legend_name,
       data_x: dataX,
       seriesData: dataNg,
       width: char_width,
       height: '14vw',
       toolTip: this.toolTip
     };
     return barData;
    }

  // 顯示PD NG圖的彈出框
  async showSubDetailNG(detail) {
    // 根据查询类别区分数据 vendor：供应商；model：机种；partNumber：料号
    if (this.selectItem.cur_searchBy === 'vendor') {
      this.service.getTraceBackList(this.selectItem.cur_site, this.selectItem.cur_plant, this.selectItem.cur_productCate, this.selectItem.cur_customer,
      detail['seriesName'] === 'close' ? 'close' : detail['seriesName'] === 'ongoing' ? 'ongoing' : 'open',
      this.selectItem.cur_model, this.selectItem.cur_proName, this.selectItem.cur_materialNo, detail['name'], this.selectItem.date_from, this.selectItem.date_to).subscribe(res => {
        res.forEach(element => {
          element['objName'] = 'traceBack';
          element['expand'] = false;
        });
        this.dataNg = res;
        console.log('点击柱状图获取的数据', this.dataNg);
      });
    }
    if (this.selectItem.cur_searchBy === 'model') {
      this.service.getTraceBackList(this.selectItem.cur_site, this.selectItem.cur_plant, this.selectItem.cur_productCate, this.selectItem.cur_customer,
      detail['seriesName'] === 'close' ? 'close' : detail['seriesName'] === 'ongoing' ? 'ongoing' : 'open',
       detail['name'], this.selectItem.cur_proName, this.selectItem.cur_materialNo, undefined, this.selectItem.date_from, this.selectItem.date_to).subscribe(res => {
        res.forEach(element => {
          element['objName'] = 'traceBack';
          element['expand'] = false;
        });
        this.dataNg = res;
      });
    }
    if (this.selectItem.cur_searchBy === 'partNumber') {
      this.service.getTraceBackList(this.selectItem.cur_site, this.selectItem.cur_plant, this.selectItem.cur_productCate, this.selectItem.cur_customer,
      detail['seriesName'] === 'close' ? 'close' : detail['seriesName'] === 'ongoing' ? 'ongoing' : 'open',
      this.selectItem.cur_model, this.selectItem.cur_proName, this.toolTip[detail['dataIndex']][0]['partNumber'] , this.selectItem.cur_vendor, this.selectItem.date_from, this.selectItem.date_to).subscribe(res => {
        res.forEach(element => {
          element['objName'] = 'traceBack';
          element['expand'] = false;
        });
        this.dataNg = res;
      });
    }
    if (this.selectItem.cur_searchBy === 'predefined') {
      // 新增筛选判断
      this.service.getTraceBackList(this.selectItem.cur_site, this.selectItem.cur_plant, this.selectItem.cur_productCate, this.selectItem.cur_customer,
        detail['seriesName'] === 'close' ? 'close' : detail['seriesName'] === 'ongoing' ? 'ongoing' : 'open',
        this.selectItem.cur_model, this.selectItem.cur_proName, this.toolTip[detail['dataIndex']][0]['partNumber'] , this.selectItem.cur_vendor, this.selectItem.date_from, this.selectItem.date_to).subscribe(res => {
          res.forEach(element => {
            element['objName'] = 'traceBack';
            element['expand'] = false;
          });
          this.dataNg = res;
        });
    }
  }

    // 顯示subFormList
  showFormDetail(form) {
    console.log(form);
    this.service.getTraceBackRawDataBySN(form['number']).subscribe(result => {
      const res = result['rawData'];
      const tempData = JSON.parse(res[0]['rawData']);
      tempData[0]['headerField'] = result['headerField'];
      form['sn'] = res[0]['unitSerialNumber'];
      this.subFormsList = {form: form, rawData: JSON.stringify(tempData), date: new Date().getTime()};
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
 }
}
