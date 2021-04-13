import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MaterialEndProductComponent, MaterialPieProductComponent } from 'app/mrr/imqm/imqm-common/component';
import { ToolkitService } from '../../../../imqm-common/service';
import { FactoryUserService } from './factory-user.service';
import * as moment from 'moment';
import { getSelectLocal } from 'app/mrr/imqm/imqm-common/toolKits/autoSelect';
import { TranslateService } from '@ngx-translate/core';
import { async } from '@angular/core/testing';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-factory-user',
  templateUrl: './factory-user.component.html',
  styleUrls: ['./factory-user.component.scss']
})
export class FactoryUserComponent implements OnInit, OnDestroy {

  materialProductYRRawData: any[] = []; // 供應商材料Yield Rate
  materialProductYRBarData =  {}; // 組裝 供應商材料Yield Rate echart的資料
  materialPDDRRawData: any[] = [];  // 緯創材料D/R
  materialPDDRBarData = {}; // 組裝 緯創材料D/R echart的資料
  materialNGRawData: any[] = []; // PD材料NG追溯
  materialNGBarData: {} = {}; // PD材料NG追溯 echart
  materialAbnormalRawData: any[] = [];  // 材料廠商端Over Spec
  materialEarlyRawData: any[] = []; // 預警看板
  materialAlertBarData: {} = {}; // 組裝 供應商Over Spec/預警看板 echart的資料
  defectLossAnalyze: {} = {};  // 分析不良資料


  // YR popUp
  isVisibleYr = false;
  dataYr;
  dataDr;
  dataAlert;
  dataNg;
  subFormsList; // Over Spec,預警,追溯的二階彈出框
  // 第二層彈出
  popVendorYr;

  // auth, 查看全场
  isAuthAll = false;

  // 当前登录者的site, plant
  site = JSON.parse(localStorage.getItem('$IMQM$UserInfo'))['site'];
  plant = JSON.parse(localStorage.getItem('$IMQM$UserInfo'))['plant'];

  startDate;
  endDate;

  timer;

  subject = 'RT-factory';

   // i18n
   destroy$ = new Subject();
   trans: Object = {};

  @ViewChild('subMEndProduct')
  subMEndProduct: MaterialEndProductComponent;
  @ViewChild('subMPieProduct')
  subMPieProduct: MaterialPieProductComponent;
  @ViewChild('trdMPieProduct')
  trdMPieProduct: MaterialPieProductComponent;
  // @ViewChild('subFormsTable')
  // subFormsTable: FormL
  selectItem;
  constructor(
    private route: ActivatedRoute, private toolService: ToolkitService,
    private _service: FactoryUserService,
    private translate: TranslateService
  ) {
    this.materialProductYRRawData = this.route.snapshot.data['injectResolve']['yrTopRate'];
    this.materialPDDRRawData = this.route.snapshot.data['injectResolve']['pdTopRate']; // no
    this.materialAbnormalRawData = this.route.snapshot.data['injectResolve']['abnormalList'];
    this.materialEarlyRawData = this.route.snapshot.data['injectResolve']['earlyWarnList'];
    this.materialNGRawData = this.route.snapshot.data['injectResolve']['traceBackList'];
    this.defectLossAnalyze = this.route.snapshot.data['injectResolve']['defectAnanlyze']; // no
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(lang => {
      this.translate.get(['imq-realTime-supplierYr', 'imq-realTime-materialDr', 'imq-realTime-ngTrack', 'imq-realTime-specPrewarn',
    'imq-realTime-preWarnCount', 'imq-realTime-overSpecCount', 'imq-yr-overSpecAlys']).subscribe(res => {
      this.trans['supplierYr'] = res['imq-realTime-supplierYr'];
      this.trans['materialDr'] = res['imq-realTime-materialDr'];
      this.trans['ngTrack'] = res['imq-realTime-ngTrack'];
      this.trans['specPrewarn'] = res['imq-realTime-specPrewarn'];
      this.trans['preWarnCount'] = res['imq-realTime-preWarnCount'];
      this.trans['overSpecCount'] = res['imq-realTime-overSpecCount'];
      this.trans['overSpecAnalyze'] = res['imq-yr-overSpecAlys'];
      this.ngOnInit();
    });
    });
  }

  async ngOnInit() {
    // get this component initData
    // wait ?
    this.translate.get(['imq-realTime-supplierYr', 'imq-realTime-materialDr', 'imq-realTime-ngTrack', 'imq-realTime-specPrewarn',
    'imq-realTime-preWarnCount', 'imq-realTime-overSpecCount', 'imq-yr-overSpecAlys']).subscribe(async res => {
      this.trans['supplierYr'] = res['imq-realTime-supplierYr'];
      this.trans['materialDr'] = res['imq-realTime-materialDr'];
      this.trans['ngTrack'] = res['imq-realTime-ngTrack'];
      this.trans['specPrewarn'] = res['imq-realTime-specPrewarn'];
      this.trans['preWarnCount'] = res['imq-realTime-preWarnCount'];
      this.trans['overSpecCount'] = res['imq-realTime-overSpecCount'];
      this.trans['overSpecAnalyze'] = res['imq-yr-overSpecAlys'];
      const lastSelectItem = getSelectLocal(this.subject);
      const roles = JSON.parse(localStorage.getItem('$IMQM$UserRole'))['26'];
      this.isAuthAll = roles['read'];
      this.getCurDate();
      if (lastSelectItem && lastSelectItem[this.subject]) {
        this.queryOp(lastSelectItem[this.subject]);
      } else {
        this.timer = setInterval(async () => {
          this.getCurDate();
          const data = await this._service.getInitData();
          this.materialProductYRRawData = data['yrTopRate'];
          this.materialPDDRRawData = data['pdTopRate'];
          this.materialAbnormalRawData = data['abnormalList'];
          this.materialNGRawData = data['traceBackList'];
          this.materialEarlyRawData = data['earlyWarnList'];
          this.materialProductYRBarData = await this.wrapMaterialYRPDChar(this.materialProductYRRawData, this.trans['supplierYr'], 'Y/R', '100%');
          this.materialPDDRBarData = await this.wrapMaterialDRPDChar(this.materialPDDRRawData, this.trans['materialDr'], 'D/R', '100%');
          this.materialAlertBarData = await this.wrapmaterialAlertChar(this.materialAbnormalRawData, this.materialEarlyRawData, this.trans['specPrewarn'], [this.trans['overSpecCount'], this.trans['preWarnCount']], '100%');
          this.materialNGBarData = this.wrapmaterialNGChar(this.materialNGRawData, this.trans['ngTrack'], ['close', 'ongoing', 'open'], '100%');
          }, 1800000);
          this.materialProductYRBarData = await this.wrapMaterialYRPDChar(this.materialProductYRRawData, this.trans['supplierYr'], 'Y/R', '100%');
          this.materialPDDRBarData = await this.wrapMaterialDRPDChar(this.materialPDDRRawData, this.trans['materialDr'], 'D/R', '100%');
          this.materialAlertBarData = await this.wrapmaterialAlertChar(this.materialAbnormalRawData, this.materialEarlyRawData, this.trans['preWarnCount'], [this.trans['overSpecCount'], this.trans['preWarnCount']], '100%');
          this.materialNGBarData = this.wrapmaterialNGChar(this.materialNGRawData, this.trans['ngTrack'], ['close', 'ongoing', 'open'], '100%');
          console.log(this.materialAlertBarData);
      }
    });
  }

  // 接受下拉框传来的资料
  async queryOp(params) {
    this.selectItem = params;
    this.site = params['cur_site'];
    this.plant = params['cur_plant'];
    clearInterval(this.timer);
    this.getCurDate();
    const data = await this._service.getInitData(this.site, this.plant);
    this.materialProductYRRawData = data['yrTopRate'];
    this.materialAbnormalRawData = data['abnormalList'];
    this.materialNGRawData = data['traceBackList'];
    this.materialEarlyRawData = data['earlyWarnList'];
    this.materialPDDRRawData = data['pdTopRate'];
    // this.materialPDDRRawData = [{key: 'DAZHI', ng: 1, count: 20, percent: '6.00'}];
    this.timer = setInterval(async () => {
      this.getCurDate();
      const datas = await this._service.getInitData(this.site, this.plant);
      this.materialProductYRRawData = datas['yrTopRate'];
      this.materialAbnormalRawData = datas['abnormalList'];
      this.materialNGRawData = datas['traceBackList'];
      this.materialEarlyRawData = datas['earlyWarnList'];
      this.materialPDDRRawData = data['pdTopRate'];
      this.materialProductYRBarData = await this.wrapMaterialYRPDChar(this.materialProductYRRawData, this.trans['supplierYr'], 'Y/R', '100%');
      this.materialPDDRBarData = await this.wrapMaterialDRPDChar(this.materialPDDRRawData, this.trans['materialDr'], 'D/R', '100%');
      this.materialAlertBarData = await this.wrapmaterialAlertChar(this.materialAbnormalRawData, this.materialEarlyRawData, this.trans['specPrewarn'], [this.trans['overSpecCount'], this.trans['preWarnCount']], '100%');
      this.materialNGBarData = this.wrapmaterialNGChar(this.materialNGRawData, this.trans['ngTrack'], ['close', 'ongoing', 'open'], '100%');
      }, 1800000);
    this.materialProductYRBarData = await this.wrapMaterialYRPDChar(this.materialProductYRRawData, this.trans['supplierYr'], 'Y/R', '100%');
    this.materialPDDRBarData = await this.wrapMaterialDRPDChar(this.materialPDDRRawData, this.trans['materialDr'], 'D/R', '100%');
    this.materialAlertBarData = await this.wrapmaterialAlertChar(this.materialAbnormalRawData, this.materialEarlyRawData, this.trans['specPrewarn'], [this.trans['overSpecCount'], this.trans['preWarnCount']], '100%');
    this.materialNGBarData = this.wrapmaterialNGChar(this.materialNGRawData, this.trans['ngTrack'], ['close', 'ongoing', 'open'], '100%');
  }

  // 更新当前页面的起始时间
  getCurDate() {
    const curTime = new Date().getTime();
    const day8 = new Date(`${moment().format('YYYY-MM-DD 08:00:00')}`).getTime();
    const night8 = new Date(`${moment().format('YYYY-MM-DD 20:00:00')}`).getTime();
    if (curTime > day8 && curTime < night8 ) {
      this.startDate = day8;
      this.endDate = night8;
    } else {
      this.startDate = night8;
      this.endDate = new Date(`${moment().add(1, 'days').format('YYYY-MM-DD 08:00:00')}`).getTime();
    }
    // for test
    // this.startDate = 1561958176000;
    // this.endDate = 1564636576000;
  }
  // 顯示子層'緯創材料D/R（廠商1）'和 '廠商1供應商材料Yield Rate'
  async showSubDetailYR(detail, legend) {
    const downLoadSelect = {
      site: this.selectItem.cur_site,
      plant: this.selectItem.cur_plant,
      customer: this.selectItem.cur_customer,
      product: this.selectItem.cur_productCate,
      model: this.selectItem.cur_model,
      vendor: this.selectItem.cur_vendor,
      productName: this.selectItem.cur_proName,
      partNumber: this.selectItem.cur_materialNo,
      date_from: this.selectItem.date_from,
      date_to: this.selectItem.date_to
    };
    this.getTime(downLoadSelect);
    this.isVisibleYr = true;
    // 獲取預設target
    const yrTargetDef = await this._service.getYrTarget(this.site, this.plant, '*');
    // 根據點擊的廠商獲取料號YR
    // debugger;
    const toolTip = [];
    console.log(detail);

    downLoadSelect.vendor = detail['data']['name'];
    this._service.getPartNumYrByVendor(this.site, this.plant, detail['data']['name'], this.startDate, this.endDate).subscribe(res => {
      this._service.getDefectLossAnalyze(this.site, this.plant, detail['data']['name'], this.startDate, this.endDate).subscribe(async def => {
         // 根据料号获取相应的YR
        // debugger;
        const targetArr = [];
        for (let i = 0; i < res.length; i++) {
          const yrTarget = await this._service.getYrTarget(this.site, this.plant, res[i]['key']);
          targetArr.push(yrTarget.length > 0 ? yrTarget[0]['yrTarget'] : yrTargetDef.length > 0 ? yrTargetDef[0]['yrTarget'] : undefined);
          // const info = await this._service.getSelectInfoByPartNo(res[i]['key']);
          // info[0]['count'] = res[i]['count'];
          // res[i]['info'].map(info_item => info_item['count'] = res[i]['count']);
          toolTip.push(res[i]['info']);
        }
        this.popVendorYr = res;
        this.dataYr = {detail: {vendorYr: res, tooltip: toolTip, defectLoss: def, search_type: 'partNumber'}, preTitle: detail['data']['name'], title: this.trans['supplierYr'], legend: legend, titlePie: this.trans['overSpecAnalyze'], target: targetArr, downloadSelect: downLoadSelect};
        console.log(this.dataYr);
      });
    });
  }

  async detailAnalyze(detail) {
    // 呼叫API
    console.log(detail);
    const downLoadSelect = {
      site: this.selectItem.cur_site,
      plant: this.selectItem.cur_plant,
      customer: this.selectItem.cur_customer,
      product: this.selectItem.cur_productCate,
      model: this.selectItem.cur_model,
      vendor: this.selectItem.cur_vendor,
      productName: this.selectItem.cur_proName,
      partNumber: this.selectItem.cur_materialNo,
      date_from: this.selectItem.date_from,
      date_to: this.selectItem.date_to
    };
    this.getTime(downLoadSelect);
    const temp_partNumber_index = detail['data']['dataIndex'];
    const temp_partNumber = this.popVendorYr[temp_partNumber_index]['key'];
    detail['preTitle'] = temp_partNumber;

    downLoadSelect.vendor = detail['vendor'];
    downLoadSelect.partNumber = detail['preTitle'];

    this._service.getDefectLossAnalyze(this.site, this.plant, detail['vendor'], this.startDate, this.endDate, temp_partNumber).subscribe(res => {
      this.defectLossAnalyze = {detail: detail, drAnalyze: res, downloadSelect: downLoadSelect};
    });
  }

  showSubDetailPD(detail, legend, titlePie) {
    const toolTip = [];
    // this.dataDr = {detail: detail, title: title, legend: legend, titlePie: titlePie};
    this._service.getPartNumYrByVendorDR(this.site, this.plant, detail['data']['name'], this.startDate, this.endDate).subscribe(async res => {
      for (let i = 0; i < res.length; i++) {
        toolTip.push(res[i]['info']);
      }
      this.dataDr = {detail: {vendorDr: res, toolTip: toolTip, search_type: 'partNumber'}, preTitle: detail['data']['name'], title: this.trans['materialDr'], legend: legend, titlePie: titlePie, target: null};
    });
  }

  // 顯示預警圖的彈出框
  async showSubDetailAlert(detail) {
    console.log(detail);
    // const rawData = await this._service.getInitial();
    // debugger;
    if (detail['seriesName'] === this.trans['overSpecCount']) {
      this._service.getAbnormalList(this.site, this.plant, detail['name'], Math.ceil(this.startDate / 1000), Math.ceil(this.endDate / 1000)).subscribe(res => {
        res.forEach(element => {
          element['objName'] = 'abnormal';
          element['expand'] = false;
        });
        this.dataAlert = res;
      });
    }
    if (detail['seriesName'] === this.trans['preWarnCount']) {
      this._service.getEarlyWarningList(this.site, this.plant, detail['name'],  Math.ceil(this.startDate / 1000), Math.ceil(this.endDate / 1000)).subscribe(res => {
        res.forEach(element => {
          element['objName'] = 'earlyWarn';
          element['expand'] = false;
        });
        this.dataAlert = res;
      });
    }
    console.log(this.dataAlert);
  }

  // // 顯示PD NG圖的彈出框
  showSubDetailNG(detail) {
    console.log(detail);
    this._service.getTraceBackList(this.site, this.plant, detail['name'], detail['seriesName'], Math.ceil(this.startDate / 1000), Math.ceil(this.endDate / 1000)).subscribe(res => {
      res.forEach(element => {
        element['objName'] = 'traceBack';
        element['expand'] = false;
      });
      this.dataNg = res;
    });
  }

  // 顯示subFormList
  showFormDetail(form) {
    console.log(form);
    if (form['objName'] === 'earlyWarn') {
      this._service.getEarlyWarnRawDataBySN(form['number']).subscribe(res => {
        this.subFormsList = {form: form, rawData: res[0]['rawData'], date: new Date().getTime()};
      });
    }
    if (form['objName'] === 'abnormal') {
      this._service.getAbnormalRawDataBySN(form['number']).subscribe(result => {

        const res = result['rawData'];
        const tempData = JSON.parse(res[0]['rawData']);
        tempData['headerField'] = result['headerField'];
        this.subFormsList = {form: form, rawData: JSON.stringify(tempData), date: new Date().getTime()};

        // this.subFormsList = {form: form, rawData: res[0]['rawData'], date: new Date().getTime()};
      });
    }
    if (form['objName'] === 'traceBack') {
      this._service.getTraceBackRawDataBySN(form['number']).subscribe(result => {

        const res = result['rawData'];
        const tempData = JSON.parse(res[0]['rawData']);
        tempData[0]['headerField'] = result['headerField'];
        form['sn'] = res[0]['unitSerialNumber'];
        this.subFormsList = {form: form, rawData: JSON.stringify(tempData), date: new Date().getTime()};

        // form['sn'] = res[0]['unitSerialNumber'];
        // this.subFormsList = {form: form, rawData: res[0]['rawData'], date: new Date().getTime()};
      });
    }
  }

  // 顯示主頁'供應商材料Yield Rate 圖'和 緯創材料D/R
  async wrapMaterialYRPDChar(rowData, title, legend_name, char_width) {
    const data_x = Array(10).fill(''); const data_y = []; const data_arr = []; const target = [];
    let barData = {};
    const toolTip_vm = [];
    let yrTarget;
    // console.log(yrTarget[0]['yrTarget']);
      // rowData.map(async res => {
      // 獲取target預設值
    yrTarget = await this._service.getYrTarget(this.site, this.plant, '*');
    // debugger;
    for (let i = 0; i < rowData.length; i++) {
      const res = rowData[i];
      toolTip_vm.push(res);
      res['target'] = yrTarget.length > 0 ? yrTarget[0]['yrTarget'] : undefined;
      res['percent'] = parseFloat(res['percent']);
      data_x[i] = res['key'];
      let series_data;
      if (res['percent'] < res['target']) {
        data_arr.push({value: res['percent'].toString().includes('.') ?  res['percent'].toFixed(1) : res['percent'], itemStyle:  {color: '#fb928e'}});
        series_data = {
          value: res['percent'].toString().includes('.') ?  res['percent'].toFixed(1) : res['percent'],
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
          show: res['percent'] !== 0 ? true : false,
          formatter: '{c}%',
          position: 'inside',
          color: '#fff',
          fontSize: 12
         }
        };
      } else {
        data_arr.push({value: res['percent'].toString().includes('.') ?  res['percent'].toFixed(1) : res['percent'], itemStyle:  {color: '#60d26e'}});
        series_data = {
          value: res['percent'].toString().includes('.') ?  res['percent'].toFixed(1) : res['percent'],
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
          label: {
            show: res['percent'] !== 0 ? true : false,
            formatter: '{c}%',
            position: 'inside',
            color: '#fff',
            fontSize: 12
           }
        };
      }
      target.push(res['target']);
      data_y.push(series_data);
    // });
    }

    barData = {
      data_x: data_x,
      data_y: data_y,
      target: target,
      target_name: 'target',
      title: title,
      legend: legend_name,
      width: char_width,
      height: '17vw',
      search_type: 'vendor',
      data_arr: data_arr,
      toolTip_vm: toolTip_vm,
      toolTip_position: [10, 240]
    };

    return barData;
  }

  wrapMaterialDRPDChar(rowData, title, legend_name, char_width) {
    const data_x = Array(10).fill(''); const data_y = []; const data_arr = []; const target = [];
    let barData = {};
    const toolTip_vm = [];
      // rowData.map((res, index) => {
    for (let index = 0; index < rowData.length; index++) {
      // 獲取target預設值
      rowData[index]['percent'] = parseFloat(rowData[index]['percent']);
      data_x[index] = rowData[index]['key'];
      toolTip_vm.push(rowData[index]);
      data_arr.push({value: rowData[index]['percent'].toString().includes('.') ?  rowData[index]['percent'].toFixed(1) : rowData[index]['percent'], itemStyle:  {color: '#fb928e'}});
      let series_data;
        series_data = {
          value: rowData[index]['percent'].toString().includes('.') ?  rowData[index]['percent'].toFixed(1) : rowData[index]['percent'],
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
            show: rowData[index]['percent'] !== 0 ? true : false,
            formatter: '{c}%',
            position: 'inside',
            fontSize: 12,
            color: 'white'
           }
        };
      data_y.push(series_data);
    }

    barData = {
      data_x: data_x,
      data_y: data_y,
      target: target,
      target_name: undefined,
      title: title,
      legend: legend_name,
      width: char_width,
      height: '17vw',
      search_type: 'vendor',
      data_arr: data_arr,
      mainColor: '#038113',
      toolTip_vm: toolTip_vm
    };
    return barData;
  }

  // 顯示首頁供應商Over Spec/預警看板
  async wrapmaterialAlertChar(rowData, earlyData, title, legend_name: any[], char_width) {
    const data_x = Array(10).fill(''); const data_alert = []; const data_abnormal = []; const target = [];
    const series = [];
    // 存放柱形图图顶的资料
    const abnormalTops = []; const alertTops = [];
    let barData = {};
    // rowData.map(async res => {
    for (let i = 0; i < rowData.length; i ++) {
      // debugger;
      abnormalTops.push({value: rowData[i]['count'],
      itemStyle: {
        color: '#fb928e'
    }});
      data_x[i] = rowData[i]['name'];
      const series_abnormal = {
        value: rowData[i]['count'],
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
            show: rowData[i]['count'] !== 0 ? true : false,
            position: 'inside',
            fontSize: 12,
            color: 'white'
          }
      };

      const earlys = await this._service.getEarlyListByVendor(this.site, this.plant, rowData[i]['name'], Math.ceil(this.startDate / 1000), Math.ceil(this.endDate / 1000));
      alertTops.push({value: earlys['result'].length > 0 ? earlys['result'][0]['count'] : 0,
      itemStyle: {
        color: '#FFC409'
    }});
      data_alert.push({
        value: earlys['result'].length > 0 ? earlys['result'][0]['count'] : 0,
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
          show: earlys['result'][0] && earlys['result'][0]['count'] !== 0 ? true : false,
          position: 'inside',
          fontSize: 12,
          color: 'white'
         }
      });
      data_abnormal.push(series_abnormal);
    }

      // go-live 新增逻辑，如果無異常數據但預警有，會顯示預警資料，若有異常資料，則以異常為主
      if (rowData.length === 0 && earlyData.length !== 0) {
        for (let j = 0; j < earlyData.length; j++) {
          data_x[j] = earlyData[j]['name'];
          alertTops.push({value: earlyData[j]['count'],
          itemStyle: {
            color: '#FFC409'
        }});
        data_alert.push({
          value: earlyData[j]['count'],
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
            show: earlyData.length > 0 ? true : false,
            position: 'inside',
            fontSize: 12,
            color: 'white'
           }
        });
        }
      }

    // 新增判斷，如果沒有 異常資料，就只顯示預警

    const abnormal = {
      name: legend_name[0],
      type: 'bar',
      data: data_abnormal,
      barWidth: '40%',
      z: 12,
      tooltip : {
        backgroundColor: 'rgba(255,255,255,1)',
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
          }
        }
    };
    const alert = {
      name: legend_name[1],
      type: 'bar',
      data: data_alert,
      barWidth: '40%',
      z: 12,
      tooltip : {
        backgroundColor: 'rgba(255,255,255,1)',
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
        }
      }
    };
    series.push(abnormal);
    series.push(alert);
    series.push({
        name: legend_name[0],
        type: 'pictorialBar',
        symbolSize: ['50%', 10],
        symbolOffset: ['-65%', -5],
        symbolPosition: 'end',
        silent: true,
        label: {
          show: false,
          position: 'top',
          formatter: '{c}%'
        },
        data: abnormalTops,
        tooltip: {
          showContent: false
        }
    });
    series.push({
      name: legend_name[1],
      type: 'pictorialBar',
      symbolSize: ['50%', 10],
      symbolOffset: ['65%', -5],
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
      legend: legend_name,
      width: char_width,
      height: '14vw',
      series: series
    };
    console.log(barData);
    return barData;
  }

   // 顯示首頁PD材料PD追溯
   wrapmaterialNGChar(rowData, title, legend_name, char_width) {
    const dataX = Array(10).fill(''); const dataNg = []; const close = []; const onGoing = []; const open = [];
   const data_arr = []; // 总数
   const data_close = []; // close的数量
   const data_onGoing = [];
   const toolTip = [];
    rowData.map((res, index) => {
      // debugger;
      toolTip.push(res['info']);
      dataX[index] = res['name'];
      data_arr.push({value: res['close'] + res['ongoing'] + res['open'], itemStyle: {color:
        res['open'] !== 0 ? '#fb928e' : res['ongoing'] !== 0 ? '#FFC409' : '#60d26e'
      }});
      if (res['close'] !== 0 && res['ongoing'] !== 0) {
        data_close.push({value: res['close'], itemStyle:  {color: '#FFC409'}});
      }
      if (res['ongoing'] !== 0 && res['open'] !== 0) {
        data_onGoing.push({value: res['close'] + res['ongoing'], itemStyle: {
    color: '#fb928e'
        }});
      }
      close.push({value: res['close'], label: {
        show: res['close'] !== 0 ? true : false,
        position: 'inside',
        fontSize: 12,
        color: 'white'
        }});
      onGoing.push({value: res['ongoing'], label: {show: res['ongoing'] !== 0 ? true : false,
      position: 'inside',
      fontSize: 12,
      color: 'white'
      } });
      open.push({value: res['open'], label: {show: res['open'] !== 0 ? true : false,
      position: 'inside',
      fontSize: 12,
      color: 'white'
     } });
    });
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

    dataNg.push(seriesClose);
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

    dataNg.push(seriesOngoing);
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
    const barData = {
      title: title,
      legend: legend_name,
      data_x: dataX,
      seriesData: dataNg,
      width: char_width,
      toolTip: toolTip,
      height: '14vw'
    };
    console.log(dataNg);
    return barData;
   }

   ngOnDestroy(): void {
    clearInterval(this.timer);
    this.destroy$.next();
    this.destroy$.complete();
   }

   getTime(downLoadSelect) {
    const curTime = new Date().getTime();
    const day8 = new Date(`${moment().format('YYYY-MM-DD 08:00:00')}`).getTime();
    const night8 = new Date(`${moment().format('YYYY-MM-DD 20:00:00')}`).getTime();
    let startDate;
    let endDate;
    if (curTime > day8 && curTime < night8 ) {
      startDate = day8;
      endDate = night8;
    } else {
      startDate = night8;
      endDate = new Date(`${moment().add(1, 'days').format('YYYY-MM-DD 08:00:00')}`).getTime();
    }
    downLoadSelect.date_from = startDate;
    downLoadSelect.date_to = endDate;
   }
}
