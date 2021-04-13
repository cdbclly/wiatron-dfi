import { Component, OnInit, ViewChild, Output, OnDestroy } from '@angular/core';
import { MaterialEndProductComponent, MaterialPieProductComponent } from '../../../../imqm-common/component';
import { SummaryService } from './summary.service';
import { SelectItems } from '../../../../imqm-common/toolKits/model';
import { getSelectLocal } from '../../../../imqm-common/toolKits/autoSelect';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NzI18nService, zh_TW, en_US } from 'ng-zorro-antd';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit, OnDestroy {

  materialProductYRRawData: any[] = []; // 供應商材料Yield Rate
  materialProductYRBarData; // 組裝 供應商材料Yield Rate echart的資料
  materialPDDRRawData: any[] = [];  // 緯創材料D/R
  materialPDDRBarData: {}; // 組裝 緯創材料D/R echart的資料
  materialNGRawData: any[] = []; // PD材料NG追溯
  materialNGBarData: {}; // PD材料NG追溯 echart
  materialAlertRawData: any[] = [];  // 供應商Over Spec/預警看板
  materialAlertBarData: {}; // 組裝 供應商Over Spec/預警看板 echart的資料
  defectLossAnalyze: {};  // 分析不良資料
  defectLossAnalyzeByPartNo: {} // by 料号查询的Over Spec 分析资料
  materialEarlyRawData;

  dataYr;
  dataDr;
  dataAlert;
  dataNg;
  require = false;

  popYrData;

  // cur_site;
  // cur_plant;
  // cur_productCate;
  // cur_customer;
  // cur_searchBy;
  // cur_model;
  // cur_vendor;
  // cur_proName;
  // cur_materialNo;
  // date_from;
  // date_to;

  // toolTip
  toolTipAlert = [];
  toolTipNg = [];
  subject = 'summary';
  selectItem: SelectItems;

  subFormsList;

  destroy$ = new Subject();
  trans: Object = {};

  @ViewChild('subMEndProduct')
  subMEndProduct: MaterialEndProductComponent;
  @ViewChild('subMPieProduct')
  subMPieProduct: MaterialPieProductComponent;
  @ViewChild('trdMPieProduct')
  trdMPieProduct: MaterialPieProductComponent;

  constructor(
    private _service: SummaryService,
    private translate: TranslateService,
    private nzI18nService: NzI18nService
    ) {
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
    this.translate.get(['imq-realTime-supplierYr', 'imq-realTime-materialDr', 'imq-realTime-ngTrack', 'imq-realTime-specPrewarn',
    'imq-realTime-preWarnCount', 'imq-realTime-overSpecCount', 'imq-yr-overSpecAlys']).subscribe(res => {
      this.trans['supplierYr'] = res['imq-realTime-supplierYr'];
      this.trans['materialDr'] = res['imq-realTime-materialDr'];
      this.trans['ngTrack'] = res['imq-realTime-ngTrack'];
      this.trans['specPrewarn'] = res['imq-realTime-specPrewarn'];
      this.trans['preWarnCount'] = res['imq-realTime-preWarnCount'];
      this.trans['overSpecCount'] = res['imq-realTime-overSpecCount'];
      this.trans['overSpecAnalyze'] = res['imq-yr-overSpecAlys'];
      const lastSelectItem = getSelectLocal(this.subject);
      // const lang = this.translate.currentLang ? this.translate.currentLang : this.translate.defaultLang;
      // if (lang  === 'en') {
      //   this.nzI18nService.setLocale(en_US);
      // } else {
      //   this.nzI18nService.setLocale(zh_TW);
      // }
      if (lastSelectItem && lastSelectItem[this.subject]) {
        this.query(lastSelectItem[this.subject]);
      }
    });
  }

  async query(params) {
    console.log(params);
    this.selectItem = params;

    const faseData = await this._service.getBoardData(this.selectItem.cur_searchBy, {site: this.selectItem.cur_site, plant: this.selectItem.cur_plant, customer: this.selectItem.cur_customer, product: this.selectItem.cur_productCate,
      model: this.selectItem.cur_model, vendor: this.selectItem.cur_vendor, productName: this.selectItem.cur_proName, partNumber: this.selectItem.cur_materialNo
     }, Math.ceil(this.selectItem.date_from / 1000), Math.ceil(this.selectItem.date_to / 1000));
     console.log(faseData);
    this.materialProductYRRawData = faseData['yrTopRate'];
    this.materialPDDRRawData = faseData['pdTopRate'];
    this.materialAlertRawData = faseData['abnormalList'];
    this.materialNGRawData = faseData['traceBackList'];
    this.materialEarlyRawData = faseData['earlyWarnList'];
    // this.defectLossAnalyze = faseData['defectAnanlyze'];
    this.materialProductYRBarData = await this.wrapMaterialYRPDChar(this.materialProductYRRawData, this.trans['supplierYr'], 'Y/R', '100%');
    this.materialPDDRBarData = await this.wrapMaterialDRPDChar(this.materialPDDRRawData, this.trans['materialDr'], 'D/R', '100%');
    this.materialAlertBarData = await this.wrapmaterialAlertChar(this.materialAlertRawData, this.materialEarlyRawData, this.trans['specPrewarn'], [this.trans['overSpecCount'], this.trans['preWarnCount']], '100%');
    this.materialNGBarData = await this.wrapmaterialNGChar(this.materialNGRawData, this.trans['ngTrack'], ['close', 'ongoing', 'open'], '100%');
    // console.log(faseData, this.defectLossAnalyze);
  }

  // 顯示子層'緯創材料D/R（廠商1）'和 '廠商1供應商材料Yield Rate'
  async showSubDetailYR(detail, legend) {
    const yrTargetDef = await this._service.getYrTarget(this.selectItem.cur_site, this.selectItem.cur_plant, '*', '*');
    console.log('点击二层传入的数据 \n', detail, legend);
    const toolTip = [];

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
    if (this.selectItem.cur_searchBy === 'vendor' ) {
      downLoadSelect.vendor = detail['data']['name'];
      // 顯示彈出層‘料號’
      this._service.getPartNumYrByVendor(this.selectItem.cur_site, this.selectItem.cur_plant, detail['data']['name'], this.selectItem.date_from, this.selectItem.date_to).subscribe(res => {
        this._service.getDefectLossAnalyzeByVendor(this.selectItem.cur_site, this.selectItem.cur_plant, detail['data']['name'], this.selectItem.date_from, this.selectItem.date_to).subscribe(async def => {
          const targetArr = [];
         for (let i = 0; i < res.length; i++) {
          const yrTarget = await this._service.getYrTarget(this.selectItem.cur_site, this.selectItem.cur_plant, '*', res[i]['key']);
          targetArr.push(yrTarget.length > 0 ? yrTarget[0]['yrTarget'] : yrTargetDef.length > 0 ? yrTargetDef[0]['yrTarget'] : undefined);
          toolTip.push(res[i]['info']);
          }
          this.popYrData = res;
          this.dataYr = {detail: {vendorYr: res, tooltip: toolTip, defectLoss: def, search_type: 'partNumber'}, preTitle: detail['data']['name'], title: this.trans['supplierYr'], legend: legend, titlePie: this.trans['overSpecAnalyze'], target: targetArr, downloadSelect: downLoadSelect};
          console.log(this.dataYr);
        });
      });
    }
    if (this.selectItem.cur_searchBy === 'model') {
      downLoadSelect.model = detail['data']['name'];
      this._service.getPartNumYrByModel(this.selectItem.cur_site, this.selectItem.cur_plant, detail['data']['name'], this.selectItem.date_from, this.selectItem.date_to).subscribe(res => {
        this._service.getDefectLossAnalyzeByModel(this.selectItem.cur_site, this.selectItem.cur_plant, detail['data']['name'], this.selectItem.date_from, this.selectItem.date_to).subscribe(async def => {
          const targetArr = [];
          for (let i = 0; i < res.length; i++) {
          const yrTarget = await this._service.getYrTarget(this.selectItem.cur_site, this.selectItem.cur_plant, detail['data']['name'], res[i]['key']);
          targetArr.push(yrTarget.length > 0 ? yrTarget[0]['yrTarget'] : yrTargetDef.length > 0 ? yrTargetDef[0]['yrTarget'] : undefined);
          toolTip.push(res[i]['info']);
          }
          this.popYrData = res;
          this.dataYr = {detail: {vendorYr: res, tooltip: toolTip, defectLoss: def, search_type: 'partNumber'}, preTitle: detail['data']['name'], title: this.trans['supplierYr'], legend: legend, titlePie: this.trans['overSpecAnalyze'], target: targetArr, downloadSelect: downLoadSelect};
          console.log(this.dataYr);
        });
      });
    }



    if (this.selectItem.cur_searchBy === 'predefined') {
      if (detail['other'] === 'vendor') {
        downLoadSelect.vendor = detail['data']['name'];
        // 顯示彈出層‘料號’
        this._service.getPartNumYrByVendor(this.selectItem.cur_site, this.selectItem.cur_plant, detail['data']['name'], this.selectItem.date_from, this.selectItem.date_to).subscribe(res => {
          this._service.getDefectLossAnalyzeByVendor(this.selectItem.cur_site, this.selectItem.cur_plant, detail['data']['name'], this.selectItem.date_from, this.selectItem.date_to).subscribe(async def => {
            const targetArr = [];
           for (let i = 0; i < res.length; i++) {
            const yrTarget = await this._service.getYrTarget(this.selectItem.cur_site, this.selectItem.cur_plant, '*', res[i]['key']);
            targetArr.push(yrTarget.length > 0 ? yrTarget[0]['yrTarget'] : yrTargetDef.length > 0 ? yrTargetDef[0]['yrTarget'] : undefined);
            toolTip.push(res[i]['info']);
            }
            this.popYrData = res;
            this.dataYr = {detail: {vendorYr: res, tooltip: toolTip, defectLoss: def, search_type: 'partNumber'}, preTitle: detail['data']['name'], title: this.trans['supplierYr'], legend: legend, titlePie: this.trans['overSpecAnalyze'], target: targetArr, downloadSelect: downLoadSelect};
            console.log(this.dataYr);
          });
        });
      }

      if (detail['other'] === 'model') {
        downLoadSelect.model = detail['data']['name'];
        this._service.getPartNumYrByModel(this.selectItem.cur_site, this.selectItem.cur_plant, detail['data']['name'], this.selectItem.date_from, this.selectItem.date_to).subscribe(res => {
          this._service.getDefectLossAnalyzeByModel(this.selectItem.cur_site, this.selectItem.cur_plant, detail['data']['name'], this.selectItem.date_from, this.selectItem.date_to).subscribe(async def => {
            const targetArr = [];
            for (let i = 0; i < res.length; i++) {
            const yrTarget = await this._service.getYrTarget(this.selectItem.cur_site, this.selectItem.cur_plant, detail['data']['name'], res[i]['key']);
            targetArr.push(yrTarget.length > 0 ? yrTarget[0]['yrTarget'] : yrTargetDef.length > 0 ? yrTargetDef[0]['yrTarget'] : undefined);
            toolTip.push(res[i]['info']);
            }
            this.popYrData = res;
            this.dataYr = {detail: {vendorYr: res, tooltip: toolTip, defectLoss: def, search_type: 'partNumber'}, preTitle: detail['data']['name'], title: this.trans['supplierYr'], legend: legend, titlePie: this.trans['overSpecAnalyze'], target: targetArr, downloadSelect: downLoadSelect};
            console.log('22222222222222');
            console.log(res, this.dataYr);
          });
        });
      }


      if (detail['other'] === 'productName') {
        downLoadSelect.model = detail['data']['name'];
        this._service.getPartNumYrByPartNumber(this.selectItem.cur_site, this.selectItem.cur_plant, detail['data']['name'], this.selectItem.date_from, this.selectItem.date_to).subscribe(res => {
          this._service.getDefectLossAnalyzeBPartNumber(this.selectItem.cur_site, this.selectItem.cur_plant, this.selectItem.cur_model, this.selectItem.date_from, this.selectItem.date_to, detail['data']['name']).subscribe(async def => {
            const targetArr = [];
            for (let i = 0; i < res.length; i++) {
            const yrTarget = await this._service.getYrTargetByProductName(this.selectItem.cur_site, this.selectItem.cur_plant, detail['data']['name'], res[i]['key']);
            targetArr.push(yrTarget.length > 0 ? yrTarget[0]['yrTarget'] : yrTargetDef.length > 0 ? yrTargetDef[0]['yrTarget'] : undefined);
            toolTip.push(res[i]['info']);
            }
            this.popYrData = res;
            this.dataYr = {detail: {vendorYr: res, tooltip: toolTip, defectLoss: def, search_type: 'partNumber'}, preTitle: detail['data']['name'], title: this.trans['supplierYr'], legend: legend, titlePie: this.trans['overSpecAnalyze'], target: targetArr, downloadSelect: downLoadSelect};
            console.log('111111111111111111111');
            console.log(res, this.dataYr);
          });
        });
      }


    }



  }

  showSubDetailPD(detail, legend, titlePie) {
    const toolTip = [];
    if (this.selectItem.cur_searchBy === 'vendor' ) {
      // 顯示彈出層‘料號’
      this._service.getPartNumDrByVendor(this.selectItem.cur_site, this.selectItem.cur_plant, detail['data']['name'], this.selectItem.date_from, this.selectItem.date_to).subscribe(async res => {
        for (let i = 0; i < res.length; i++) {
          toolTip.push(res[i]['info']);
        }
        this.dataDr = {detail: {vendorDr: res, toolTip: toolTip, search_type: 'partNumber'}, preTitle: detail['data']['name'], title: this.trans['materialDr'], legend: legend, titlePie: titlePie};
      });
    }
    if (this.selectItem.cur_searchBy === 'model') {
      this._service.getPartNumDrByModel(this.selectItem.cur_site, this.selectItem.cur_plant, detail['data']['name'], this.selectItem.date_from, this.selectItem.date_to).subscribe(async res => {
        for (let i = 0; i < res.length; i++) {
          toolTip.push(res[i]['info']);
        }
        this.dataDr = {detail: {vendorDr: res, toolTip: toolTip, search_type: 'partNumber'}, preTitle: detail['data']['name'], title: this.trans['materialDr'], legend: legend, titlePie: titlePie};
      });
    }


    if (this.selectItem.cur_searchBy === 'predefined') {
      if (this.selectItem.cur_materialNo) {
        // 如果选择项有料号，则不显示下一层
        return;
      } else if (this.selectItem.cur_model) {
        this._service.getPartNumDrByModel(this.selectItem.cur_site, this.selectItem.cur_plant, detail['data']['name'], this.selectItem.date_from, this.selectItem.date_to).subscribe(async res => {
          for (let i = 0; i < res.length; i++) {
            toolTip.push(res[i]['info']);
          }
          this.dataDr = {detail: {vendorDr: res, toolTip: toolTip, search_type: 'partNumber'}, preTitle: detail['data']['name'], title: this.trans['materialDr'], legend: legend, titlePie: titlePie};
        });
      } else if (this.selectItem.cur_vendor) {
        this._service.getPartNumDrByVendor(this.selectItem.cur_site, this.selectItem.cur_plant, detail['data']['name'], this.selectItem.date_from, this.selectItem.date_to).subscribe(async res => {
          for (let i = 0; i < res.length; i++) {
            toolTip.push(res[i]['info']);
          }
          this.dataDr = {detail: {vendorDr: res, toolTip: toolTip, search_type: 'partNumber'}, preTitle: detail['data']['name'], title: this.trans['materialDr'], legend: legend, titlePie: titlePie};
        });
      } else {
        this._service.getPartNumDrByProductName(this.selectItem.cur_site, this.selectItem.cur_plant, detail['data']['name'], this.selectItem.date_from, this.selectItem.date_to).subscribe(async res => {
          for (let i = 0; i < res.length; i++) {
            toolTip.push(res[i]['info']);
          }
          this.dataDr = { detail: { vendorDr: res, toolTip: toolTip, search_type: 'partNumber' }, preTitle: detail['data']['name'], title: this.trans['materialDr'], legend: legend, titlePie: titlePie };
        });
      }
    }
  }

  async detailAnalyze(detail) {
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
    if (this.selectItem.cur_searchBy === 'vendor') {
      const temp_partNumber_index = detail['data']['dataIndex'];
      const temp_partNumber = this.popYrData[temp_partNumber_index]['key'];
      detail['preTitle'] = temp_partNumber;
      downLoadSelect.vendor = detail['vendor'];
      downLoadSelect.partNumber = temp_partNumber;
      this._service.getDefectLossAnalyzeByVendor(this.selectItem.cur_site, this.selectItem.cur_plant, detail['vendor'], this.selectItem.date_from, this.selectItem.date_to, temp_partNumber).subscribe(res => {
        this.defectLossAnalyze = {detail: detail, drAnalyze: res, downloadSelect: downLoadSelect};
      });
    }
    if (this.selectItem.cur_searchBy === 'model') {
      const temp_partNumber_index = detail['data']['dataIndex'];
      const temp_partNumber = this.popYrData[temp_partNumber_index]['key'];
      detail['preTitle'] = temp_partNumber;
      downLoadSelect.model = detail['vendor'];
      downLoadSelect.partNumber = detail['preTitle'];
      this._service.getDefectLossAnalyzeByModel(this.selectItem.cur_site, this.selectItem.cur_plant, detail['vendor'], this.selectItem.date_from, this.selectItem.date_to, temp_partNumber).subscribe(res => {
        this.defectLossAnalyze = {detail: detail, drAnalyze: res, downloadSelect: downLoadSelect};
      });
    }
    if (this.selectItem.cur_searchBy === 'partNumber') {
      detail['preTitle'] = detail['partNumber'];
      detail['titlePie'] = this.trans['overSpecAnalyze'];
      downLoadSelect.partNumber = detail['partNumber'];
      this._service.getDefectLossAnalyzeByPartNo(this.selectItem.cur_site, this.selectItem.cur_plant, detail['partNumber'], this.selectItem.date_from, this.selectItem.date_to).subscribe(res => {
        this.defectLossAnalyze = {detail: detail, drAnalyze: res, downloadSelect: downLoadSelect};
      });
    }



    if (this.selectItem.cur_searchBy === 'predefined') {
      if (this.selectItem.cur_materialNo) {
        detail['preTitle'] = detail['partNumber'];
        detail['titlePie'] = this.trans['overSpecAnalyze'];
        downLoadSelect.partNumber = detail['partNumber'];
        this._service.getDefectLossAnalyzeByPartNo(this.selectItem.cur_site, this.selectItem.cur_plant, detail['partNumber'], this.selectItem.date_from, this.selectItem.date_to).subscribe(res => {
          this.defectLossAnalyze = {detail: detail, drAnalyze: res, downloadSelect: downLoadSelect};
        });
      } else if (this.selectItem.cur_model) {
        const temp_partNumber_index = detail['data']['dataIndex'];
        const temp_partNumber = this.popYrData[temp_partNumber_index]['key'];
        detail['preTitle'] = temp_partNumber;
        downLoadSelect.model = detail['vendor'];
        downLoadSelect.partNumber = detail['preTitle'];
        this._service.getDefectLossAnalyzeByModel(this.selectItem.cur_site, this.selectItem.cur_plant, detail['vendor'], this.selectItem.date_from, this.selectItem.date_to, temp_partNumber).subscribe(res => {
          this.defectLossAnalyze = {detail: detail, drAnalyze: res, downloadSelect: downLoadSelect};
        });
      } else if (this.selectItem.cur_vendor) {
        const temp_partNumber_index = detail['data']['dataIndex'];
        const temp_partNumber = this.popYrData[temp_partNumber_index]['key'];
        detail['preTitle'] = temp_partNumber;
        downLoadSelect.vendor = detail['vendor'];
        downLoadSelect.partNumber = temp_partNumber;
        this._service.getDefectLossAnalyzeByVendor(this.selectItem.cur_site, this.selectItem.cur_plant, detail['vendor'], this.selectItem.date_from, this.selectItem.date_to, temp_partNumber).subscribe(res => {
          this.defectLossAnalyze = {detail: detail, drAnalyze: res, downloadSelect: downLoadSelect};
        });
      } else {
        const temp_partNumber_index = detail['data']['dataIndex'];
        const temp_partNumber = this.popYrData[temp_partNumber_index]['key'];
        detail['preTitle'] = temp_partNumber;
        downLoadSelect.partNumber = detail['partNumber'];
        this._service.getDefectLossAnalyzeByPartNo(this.selectItem.cur_site, this.selectItem.cur_plant, detail['partNumber'], this.selectItem.date_from, this.selectItem.date_to).subscribe(res => {
          this.defectLossAnalyze = {detail: detail, drAnalyze: res, downloadSelect: downLoadSelect};
        });
      }
    }


  }

  // 顯示預警圖的彈出框
  showSubDetailAlert(detail) {
    console.log(detail);
    // debugger;
    if (detail['seriesName'] === this.trans['overSpecCount']) {
      this._service.getAbnormalList({site: this.selectItem.cur_site, plant: this.selectItem.cur_plant, customer: this.selectItem.cur_customer, product: this.selectItem.cur_productCate,
        model: this.selectItem.cur_searchBy === 'model' ? detail['name'] : this.selectItem.cur_model,
        vendor: this.selectItem.cur_searchBy === 'vendor' ? detail['name'] : this.selectItem.cur_vendor, productName: this.selectItem.cur_proName,
        partNumber: this.selectItem.cur_searchBy === 'partNumber' ? this.toolTipAlert[detail['dataIndex']]['partNumber'] : this.selectItem.cur_materialNo
       }, Math.ceil(this.selectItem.date_from / 1000), Math.ceil(this.selectItem.date_to / 1000)).subscribe(res => {
        console.log(res);
        res.forEach(element => {
          element['objName'] = 'abnormal';
          element['expand'] = false;
        });
        this.dataAlert = res;
      });
    }
    if (detail['seriesName'] ===  this.trans['preWarnCount']) {
      this._service.getEarlyWarningList({site: this.selectItem.cur_site, plant: this.selectItem.cur_plant, customer: this.selectItem.cur_customer, product: this.selectItem.cur_productCate,
        model: this.selectItem.cur_searchBy === 'model' ? detail['name'] : this.selectItem.cur_model,
        vendor: this.selectItem.cur_searchBy === 'vendor' ? detail['name'] : this.selectItem.cur_vendor, productName: this.selectItem.cur_proName,
        partNumber: this.selectItem.cur_searchBy === 'partNumber' ? this.toolTipAlert[detail['dataIndex']]['partNumber'] : this.selectItem.cur_materialNo
       }, Math.ceil(this.selectItem.date_from / 1000), Math.ceil(this.selectItem.date_to / 1000)).subscribe(res => {
        res.forEach(element => {
          element['objName'] = 'earlyWarn';
          element['expand'] = false;
        });
        this.dataAlert = res;
      });
    }
    // this.dataAlert = detail;
  }

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

  // // 顯示PD NG圖的彈出框
  showSubDetailNG(detail) {
    // this.dataNg = detail;
    console.log(detail);
    if (this.selectItem.cur_searchBy === 'vendor') {
      this._service.getTraceBackList({site: this.selectItem.cur_site, plant: this.selectItem.cur_plant, customer: this.selectItem.cur_customer, product: this.selectItem.cur_productCate,
        model: this.selectItem.cur_model, vendor: detail['name'], productName: this.selectItem.cur_proName, partNumber: this.selectItem.cur_materialNo,
        status: detail['seriesName'] === 'close' ? 'close' : detail['seriesName'] === 'ongoing' ? 'ongoing' : 'open',
       },  Math.ceil(this.selectItem.date_from / 1000), Math.ceil(this.selectItem.date_to / 1000)).subscribe(res => {
        res.forEach(element => {
          element['objName'] = 'traceBack';
          element['expand'] = false;
        });
        this.dataNg = res;
      });
    }
    if (this.selectItem.cur_searchBy === 'model') {
      this._service.getTraceBackList({site: this.selectItem.cur_site, plant: this.selectItem.cur_plant, customer: this.selectItem.cur_customer, product: this.selectItem.cur_productCate,
        model: detail['name'], vendor: this.selectItem.cur_vendor, productName: this.selectItem.cur_proName, partNumber: this.selectItem.cur_materialNo,
        status: detail['seriesName'] === 'close' ? 'close' : detail['seriesName'] === 'ongoing' ? 'ongoing' : 'open',
       },  Math.ceil(this.selectItem.date_from / 1000), Math.ceil(this.selectItem.date_to / 1000)).subscribe(res => {
        res.forEach(element => {
          element['objName'] = 'traceBack';
          element['expand'] = false;
        });
        this.dataNg = res;
      });
    }
    if (this.selectItem.cur_searchBy === 'partNumber') {
      this._service.getTraceBackList({site: this.selectItem.cur_site, plant: this.selectItem.cur_plant, customer: this.selectItem.cur_customer, product: this.selectItem.cur_productCate,
        model: this.selectItem.cur_model, vendor: this.selectItem.cur_vendor, productName: this.selectItem.cur_proName, partNumber: this.toolTipNg[detail['dataIndex']][0]['partNumber'],
        status: detail['seriesName'] === 'close' ? 'close' : detail['seriesName'] === 'ongoing' ? 'ongoing' : 'open',
       },  Math.ceil(this.selectItem.date_from / 1000), Math.ceil(this.selectItem.date_to / 1000)).subscribe(res => {
        res.forEach(element => {
          element['objName'] = 'traceBack';
          element['expand'] = false;
        });
        this.dataNg = res;
      });
    }

    if (this.selectItem.cur_searchBy === 'predefined') {
      this._service.getTraceBackList({site: this.selectItem.cur_site, plant: this.selectItem.cur_plant, customer: this.selectItem.cur_customer, product: this.selectItem.cur_productCate,
        model: this.selectItem.cur_model, vendor: this.selectItem.cur_vendor, productName: this.selectItem.cur_proName, partNumber: this.toolTipNg[detail['dataIndex']][0]['partNumber'],
        status: detail['seriesName'] === 'close' ? 'close' : detail['seriesName'] === 'ongoing' ? 'ongoing' : 'open',
       },  Math.ceil(this.selectItem.date_from / 1000), Math.ceil(this.selectItem.date_to / 1000)).subscribe(res => {
        res.forEach(element => {
          element['objName'] = 'traceBack';
          element['expand'] = false;
        });
        this.dataNg = res;
      });
    }


  }
  // 顯示主頁'供應商材料Yield Rate 圖'和 緯創材料D/R
  async wrapMaterialYRPDChar(rowData, title, legend_name, char_width) {
    const data_x = Array(10).fill(''); const data_y = []; const target = [];
    const toolTip = [];
    const toolTip_vm = [];
    let barData = {};
    const data_arr = []; // bar图图顶数据
    let yrTarget;
    let other; // other 做为选择自定义时到底选择了供应商、机种、料号、品名中的哪一个
    // debugger;
    const yrTargetDef = await this._service.getYrTarget(this.selectItem.cur_site, this.selectItem.cur_plant, '*', '*');
    if (rowData) {
      for (let i = 0; i < rowData.length; i++) {
        const res = rowData[i];
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



        // yrTarget 存在多笔的话取平均
        const avg = yrTarget.reduce((sum, cur) => sum + cur['yrTarget'], 0) / yrTarget.length;
        res['target'] = yrTarget.length > 0 ? avg : yrTargetDef.length > 0 ? yrTargetDef[0]['yrTarget'] : undefined;
        res['percent'] = parseFloat(res['percent']);
        // 除開By 料號查詢的以外都會顯示x軸信息
        // data_x[i] = res['key'];


        if (this.selectItem.cur_searchBy === 'predefined') {
          if (res['info']) {
            toolTip.push(res['info']);
            if (res['info'][0]['partNumber'] && this.selectItem.cur_materialNo) {
              other = 'partNumber';
            } else if (res['info'][0]['model'] && this.selectItem.cur_model) {
              other = 'model';
            } else if (!this.selectItem.cur_vendor && !this.selectItem.cur_model && this.selectItem.cur_proName && !this.selectItem.cur_materialNo) {
              other = 'productName';
            }
          } else {
            other = 'vendor';
          }
          data_x[i] = rowData[i]['key'];
          if (rowData[i]['key'].includes('.') && data_x[i].split('.').length === 3) {
            data_x[i] = data_x[i].split('.');
            data_x[i].splice(0, 1);
            data_x[i] = data_x[i].join(',');
            data_x[i] = data_x[i].replace(',', '.');
          } else {
            data_x[i] = rowData[i]['key'];
            toolTip_vm.push(rowData[i]);
          }
        }


        else if (this.selectItem.cur_searchBy === 'partNumber') {
          toolTip.push(res['info']);
          data_x[i] = rowData[i]['key'];
          if (rowData[i]['key'].includes('.') && data_x[i].split('.').length === 3) {
            data_x[i] = data_x[i].split('.');
            data_x[i].splice(0, 1);
            data_x[i] = data_x[i].join(',');
            data_x[i] = data_x[i].replace(',', '.');
          }
        } else {
          data_x[i] = rowData[i]['key'];
          toolTip_vm.push(rowData[i]);
        }
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
            fontSize: 12,
            color: 'white'
           }
        };
      } else {
        data_arr.push({value: res['percent'].toString().includes('.') ?  res['percent'].toFixed(1) : res['percent'], itemStyle: {color: '#60d26e'}});
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
              fontSize: 12,
              color: 'white'
             }
        };
      }
      target.push(res['target']);
      data_y.push(series_data);
    }
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
      search_type: this.selectItem.cur_searchBy,
      data_arr: data_arr,
      toolTip: toolTip,
      toolTip_vm: toolTip_vm,
      toolTip_position: [10, 240],
      other: other
    };

    console.log('二层的bar chart 数据 \n', barData);
    return barData;
  }

  async wrapMaterialDRPDChar(rowData, title, legend_name, char_width) {
    const data_x = Array(10).fill(''); const data_y = []; const target = [];
    let barData = {};
    const toolTip = [];
    const toolTip_vm = [];
    const data_arr = [];
      for (let i = 0; i < rowData.length; i++) {
      // 獲取target預設值
      const res = rowData[i];
      rowData[i]['percent'] = parseFloat(rowData[i]['percent']);
      // 除開By 料號查詢的以外都會顯示x軸信息
      // data_x[i] = rowData[i]['key'];
      if (this.selectItem.cur_searchBy === 'partNumber') {

        toolTip.push(res['info']);
        data_x[i] = rowData[i]['key'];
        if (rowData[i]['key'].includes('.') && data_x[i].split('.').length === 3) {
          data_x[i] = data_x[i].split('.');
          data_x[i].splice(0, 1);
          data_x[i] = data_x[i].join(',');
          data_x[i] = data_x[i].replace(',', '.');
        }
      } else {
        data_x[i] = rowData[i]['key'];
        toolTip_vm.push(rowData[i]);
      }
      data_arr.push({value: parseFloat(rowData[i]['percent']).toFixed(1), itemStyle: {color: '#fb928e'}});
      let series_data;
        series_data = {
          value: parseFloat(rowData[i]['percent']).toFixed(1),
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
              show: rowData[i]['percent'] !== 0 ? true : false,
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
      toolTip: toolTip,
      toolTip_vm: toolTip_vm
    };
    return barData;
  }

  // 顯示首頁供應商Over Spec/預警看板
  async wrapmaterialAlertChar(rowData, earlyData, title, legend_name, char_width) {
    const data_x = Array(10).fill(''); const data_alert = []; const data_abnormal = []; const target = [];
    const series = [];
    this.toolTipAlert = [];
    let barData = {};
     // 存放柱形图图顶的资料
     const abnormalTops = []; const alertTops = [];
    // debugger;
    if (rowData) {
      for (let i = 0; i < rowData.length; i ++) {
        // debugger;
        abnormalTops.push({value: rowData[i]['count'],
      itemStyle: {
        color: '#fb928e'
    }});
    // data_x[i] = rowData[i]['name'];
      if (this.selectItem.cur_searchBy === 'partNumber') {
        // const info = await this._service.getSelectInfoByPartNo(rowData[i]['name']);
        this.toolTipAlert.push(rowData[i]['info']);
        data_x[i] = rowData[i]['name'];
        if (rowData[i]['name'].includes('.') && data_x[i].split('.').length === 3) {
          data_x[i] = data_x[i].split('.');
          data_x[i].splice(0, 1);
          data_x[i] = data_x[i].join(',');
          data_x[i] = data_x[i].replace(',', '.');
        }
      } else {
        data_x[i] = rowData[i]['name'];
      }
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
        let earlys;
        if (this.selectItem.cur_searchBy === 'vendor') {
          earlys = await this._service.getEarlyListByVendor(this.selectItem.cur_site, this.selectItem.cur_plant, rowData[i]['name'], Math.ceil(this.selectItem.date_from / 1000), Math.ceil(this.selectItem.date_to / 1000));
        } else if (this.selectItem.cur_searchBy === 'model') {
          earlys = await this._service.getEarlyListByModel(this.selectItem.cur_site, this.selectItem.cur_plant, rowData[i]['name'],  Math.ceil(this.selectItem.date_from / 1000), Math.ceil(this.selectItem.date_to / 1000));
        } else {
          earlys = await this._service.getEarlyListByPartNo(this.selectItem.cur_site, this.selectItem.cur_plant, rowData[i]['name'],  Math.ceil(this.selectItem.date_from / 1000), Math.ceil(this.selectItem.date_to / 1000));
        }
        console.log(earlys);
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
              show: earlys['result'].length > 0 ? true : false,
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
          if (this.selectItem.cur_searchBy === 'partNumber') {
            this.toolTipAlert.push(earlyData[j]['info']);
            data_x[j] = earlyData[j]['name'];
            if (earlyData[j]['name'].includes('.') && data_x[j].split('.').length === 3) {
              data_x[j] = data_x[j].split('.');
              data_x[j].splice(0, 1);
              data_x[j] = data_x[j].join(',');
              data_x[j] = data_x[j].replace(',', '.');
            }
          } else {
            data_x[j] = earlyData[j]['name'];
          }
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
    }

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
      toolTip: this.toolTipAlert,
      height: '17vw',
      series: series
    };
    return barData;
  }

   // 顯示首頁PD材料PD追溯
   async wrapmaterialNGChar(rowData, title, legend_name, char_width) {
    const dataX = Array(10).fill(''); const dataNg = []; const close = []; const onGoing = []; const open = [];
    let yrTarget;
   const data_arr = []; // 总数
   const data_close = []; // close的数量
   this.toolTipNg = [];
   const data_onGoing = [];
   if (rowData) {
    // rowData.map((res, index) => {
    for (let i = 0; i < rowData.length; i++) {
      // debugger;
      const res = rowData[i];
      const yrTargetDef = await this._service.getYrTarget(this.selectItem.cur_site, this.selectItem.cur_plant, '*', '*');
      if (this.selectItem.cur_searchBy === 'model') {
        yrTarget = await this._service.getYrTarget(this.selectItem.cur_site, this.selectItem.cur_plant, res['key'], '*');
       }
      if (this.selectItem.cur_searchBy === 'partNumber') {
       yrTarget = await this._service.getYrTarget(this.selectItem.cur_site, this.selectItem.cur_plant, this.selectItem.cur_model ? this.selectItem.cur_model : '*', res['key'], this.selectItem.cur_proName);
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
          this.toolTipNg.push(res['info']);
          dataX[i] = rowData[i]['name'];
          if (rowData[i]['name'].includes('.') && dataX[i].split('.').length === 3) {
            dataX[i] = dataX[i].split('.');
            dataX[i].splice(0, 1);
            dataX[i] = dataX[i].join(',');
            dataX[i] = dataX[i].replace(',', '.');
          } else {
            dataX[i] = rowData[i]['name'];
          }
        }


      else if (this.selectItem.cur_searchBy === 'partNumber') {
        // const info = await this._service.getSelectInfoByPartNo(rowData[i]['name']);
        this.toolTipNg.push(res['info']);
        dataX[i] = rowData[i]['name'];
        if (rowData[i]['name'].includes('.') && dataX[i].split('.').length === 3) {
          dataX[i] = dataX[i].split('.');
          dataX[i].splice(0, 1);
          dataX[i] = dataX[i].join(',');
          dataX[i] = dataX[i].replace(',', '.');
        }
      } else {
        dataX[i] = rowData[i]['name'];
      }
      data_arr.push({value: rowData[i]['close'] + rowData[i]['ongoing'] + rowData[i]['open'], itemStyle:  {color:
        rowData[i]['open'] !== 0 ? '#fb928e' : rowData[i]['ongoing'] !== 0 ? '#FFC409' : '#60d26e'
      }});
      if (rowData[i]['close'] !== 0 && rowData[i]['ongoing'] !== 0) {
        data_close.push({value: rowData[i]['close'], itemStyle: {color: '#FFC409'}});
      }
      if (rowData[i]['ongoing'] !== 0 && rowData[i]['open'] !== 0) {
        data_onGoing.push({value: rowData[i]['close'] + rowData[i]['ongoing'], itemStyle:  {
    color: '#fb928e'
        }});
      }
      close.push({value: rowData[i]['close'], label: {
        show: rowData[i]['close'] !== 0 ? true : false,
        position: 'inside',
        fontSize: 12,
        color: 'white'
       } });
      onGoing.push({value: rowData[i]['ongoing'], label: {show: rowData[i]['ongoing'] !== 0 ? true : false,
      position: 'inside',
      fontSize: 12,
      color: 'white'
     } });
      open.push({value: rowData[i]['open'],label: {show: rowData[i]['open'] !== 0 ? true : false,
      position: 'inside',
      fontSize: 12,
      color: 'white'
     } });
    }
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
      height: '14vw',
      toolTip: this.toolTipNg
    };
    return barData;
   }

   ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
   }
}
