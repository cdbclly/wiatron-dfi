import { Component, OnInit, OnDestroy } from '@angular/core';
import { YrBoardService } from './yr-board.service';
import { getSelectLocal } from '../../imqm-common/toolKits/autoSelect';
import { SelectItems } from '../../imqm-common/toolKits/model';
import { ToolkitService } from '../../imqm-common/service';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NzI18nService, en_US, zh_TW } from 'ng-zorro-antd';
import * as moment from 'moment';

@Component({
  selector: 'app-yr-board',
  templateUrl: './yr-board.component.html',
  styleUrls: ['./yr-board.component.scss']
})
export class YrBoardComponent implements OnInit, OnDestroy {

  materialProductYrLineData: {};
  materialProductYrBarData: {};
  materialProductYrAnalyzePieData: {};
  materialProductDrBarData: {};

  require = false;
  isVisibleYr = false;
  yrTrendQueryType = { radio: 'global', select: '' };
  yrTrendPeriod = 'day';
  yrTrendTarget;
  dataYr;
  dataDr;
  defectLossAnalyze = {};
  subject = 'yieldRate';
  selectItem: SelectItems;
  destroy$ = new Subject();

  // i18n
  supMaterialYr = '供應商材料Yield Rate';
  supYrTrend = '供應商Yield Rate趨勢圖';
  overSpecAlys = 'Over Spec 分析';
  ngMaterial = '緯創材料DR';
  dayShift = '白班';
  nightShift = '夜班';
  dimension = '尺寸';
  deformaion = '變形度';
  outLook: string;
 transCount: string;
 measurement: string;

  constructor(
    private _service: YrBoardService,
    private tool: ToolkitService,
    private translate: TranslateService,
    private nzI18nService: NzI18nService
    ) {
    // if (localStorage.getItem('curLang')) {
    //   this.translate.use(localStorage.getItem('curLang'));
    // }
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(cur => {
      console.log(cur);
      // localStorage.setItem('curLang', cur.toString());
      this.translate.get(['imq-yr-supMaterialYr', 'imq-yr-supYrTrend', 'imq-yr-overSpecAlys', 'imq-yr-ngMaterial', 'imq-yr-daytShift',
      'imq-yr-nightShift', 'imq-dimension', 'imq-deformation', 'imq-yr-outlook', 'imq-yr-measurement', 'imq-yr-count']).subscribe(res => {
        this.supMaterialYr = res['imq-yr-supMaterialYr'];
        this.supYrTrend = res['imq-yr-supYrTrend'];
        this.overSpecAlys = res['imq-yr-overSpecAlys'];
        this.ngMaterial = res['imq-yr-ngMaterial'];
        this.dayShift = res['imq-yr-daytShift'];
        this.nightShift = res['imq-yr-nightShift'];
        this.dimension = res['imq-dimension'];
        this.deformaion = res['imq-deformation'];
        this.outLook = res['imq-yr-outlook'];
        this.transCount = res['imq-yr-count'];
        this.measurement = res['imq-yr-measurement'];
        if (cur.lang === 'en') {
          this.nzI18nService.setLocale(en_US);
        } else {
          this.nzI18nService.setLocale(zh_TW);
        }
        this.ngOnInit();
      });
      // this.supMaterialYr = await this.translate.get('imq-yr-supMaterialYr').toPromise();
      // this.supYrTrend = await this.translate.get('imq-yr-supYrTrend').toPromise();
      // this.overSpecAlys = await this.translate.get('imq-yr-overSpecAlys').toPromise();
      // this.ngMaterial = await this.translate.get('imq-yr-ngMaterial').toPromise();
      // this.dayShift = await this.translate.get('imq-yr-daytShift').toPromise();
      // this.nightShift = await this.translate.get('imq-yr-nightShift').toPromise();
      // this.dimension = await this.translate.get('imq-dimension').toPromise();
      // this.deformaion = await this.translate.get('imq-deformation').toPromise();
    });
  }

  ngOnInit() {
    this.translate.get(['imq-yr-supMaterialYr', 'imq-yr-supYrTrend', 'imq-yr-overSpecAlys', 'imq-yr-ngMaterial', 'imq-yr-daytShift',
    'imq-yr-nightShift', 'imq-dimension', 'imq-deformation', 'imq-yr-outlook', 'imq-yr-measurement', 'imq-yr-count']).subscribe(res => {
      this.supMaterialYr = res['imq-yr-supMaterialYr'];
      this.supYrTrend = res['imq-yr-supYrTrend'];
      this.overSpecAlys = res['imq-yr-overSpecAlys'];
      this.ngMaterial = res['imq-yr-ngMaterial'];
      this.dayShift = res['imq-yr-daytShift'];
      this.nightShift = res['imq-yr-nightShift'];
      this.dimension = res['imq-dimension'];
      this.deformaion = res['imq-deformation'];
      this.outLook = res['imq-yr-outlook'];
      this.transCount = res['imq-yr-count'];
      this.measurement = res['imq-yr-measurement'];
      const lastSelectItem = getSelectLocal(this.subject);
      if (lastSelectItem) {
        if (lastSelectItem[this.subject]) {
          this.query(lastSelectItem[this.subject]);
        }
      }
    });
  }

  async query(params) {
    console.log(params);
    this.selectItem = params;
    this.onChangeYrTrendPeriod(this.yrTrendPeriod);
    this._service.getYrData(this.selectItem.cur_searchBy, {
      site: this.selectItem.cur_site, plant: this.selectItem.cur_plant, customer: this.selectItem.cur_customer, product: this.selectItem.cur_productCate,
      model: this.selectItem.cur_model, vendor: this.selectItem.cur_vendor, productName: this.selectItem.cur_proName, partNumber: this.selectItem.cur_materialNo
    }, this.selectItem.date_from, this.selectItem.date_to).subscribe(async res => {
      this.materialProductYrBarData = await this.warpMaterialYrBarChart(res, this.supMaterialYr, 'Y/R', '100%');
      console.log(this.materialProductYrBarData);
    });
    console.log(this.materialProductYrBarData);
    this._service.getDefectLoass({
      site: this.selectItem.cur_site, plant: this.selectItem.cur_plant, customer: this.selectItem.cur_customer, product: this.selectItem.cur_productCate,
      model: this.selectItem.cur_model, vendor: this.selectItem.cur_vendor, productName: this.selectItem.cur_proName, partNumber: this.selectItem.cur_materialNo
    }, this.selectItem.date_from, this.selectItem.date_to).subscribe(res => {
      this.materialProductYrAnalyzePieData = this.wrapMaterialProductYrAnalyzeChart(res, this.overSpecAlys, '100%', this.overSpecAlys);
      console.log('良率 一层右侧饼图 数据 \n', this.materialProductYrAnalyzePieData);

    });
    console.log(this.materialProductYrBarData);
    this._service.getDrData(this.selectItem.cur_searchBy, {
      site: this.selectItem.cur_site, plant: this.selectItem.cur_plant, customer: this.selectItem.cur_customer, product: this.selectItem.cur_productCate,
      model: this.selectItem.cur_model, vendor: this.selectItem.cur_vendor, productName: this.selectItem.cur_proName, partNumber: this.selectItem.cur_materialNo
    }, this.selectItem.date_from, this.selectItem.date_to).subscribe(async res => {
      this.materialProductDrBarData = await this.wrapMaterialDRPDChar(res, this.ngMaterial, 'D/R', '100%');
    });
  }

  async showSubDetailYR(detail, title, legend, titlePie) {
    this.isVisibleYr = true;
    // 獲取預設target
    const yrTargetDef = await this._service.getTarget('yrTarget', this.selectItem.cur_site, this.selectItem.cur_plant, '*');
    // 根據點擊的廠商獲取料號YR
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
    switch (this.selectItem.cur_searchBy) {
      case 'vendor':
        downLoadSelect.vendor = detail['data']['name'];
        this._service.getPartNumYrByVendor(this.selectItem.cur_site, this.selectItem.cur_plant, detail['data']['name'], this.selectItem.date_from, this.selectItem.date_to).subscribe(res => {
          this._service.getDefectLossAnalyzeByVendor(this.selectItem.cur_site, this.selectItem.cur_plant, detail['data']['name'], this.selectItem.date_from, this.selectItem.date_to).subscribe(async def => {
            // 根据料号获取相应的YR
            const targetArr = [];
            for (let i = 0; i < res.length; i++) {
              const yrTarget = await this._service.getTarget('yrTarget', this.selectItem.cur_site, this.selectItem.cur_plant, res[i]['key']);
              targetArr.push(yrTarget.length > 0 ? yrTarget[0]['yrTarget'] : yrTargetDef.length > 0 ? yrTargetDef[0]['yrTarget'] : undefined);
              toolTip.push(res[i]['info']);
            }
            this.dataYr = { detail: { vendorYr: res, tooltip: toolTip, defectLoss: def, search_type: 'partNumber' }, preTitle: detail['data']['name'], title: title, legend: legend, titlePie: titlePie, target: targetArr, downloadSelect: downLoadSelect};
            console.log(this.dataYr);
          });
        });
        break;
      case 'model':
        downLoadSelect.model = detail['data']['name'];
        this._service.getPartNumYrByModel(this.selectItem.cur_site, this.selectItem.cur_plant, detail['data']['name'], this.selectItem.date_from, this.selectItem.date_to).subscribe(res => {
          this._service.getDefectLossAnalyzeByModel(this.selectItem.cur_site, this.selectItem.cur_plant, detail['data']['name'], this.selectItem.date_from, this.selectItem.date_to).subscribe(async def => {
            // 根据料号获取相应的YR
            // debugger;
            const targetArr = [];
            for (let i = 0; i < res.length; i++) {
              const yrTarget = await this._service.getTarget('yrTarget', this.selectItem.cur_site, this.selectItem.cur_plant, res[i]['key']);
              targetArr.push(yrTarget.length > 0 ? yrTarget[0]['yrTarget'] : yrTargetDef.length > 0 ? yrTargetDef[0]['yrTarget'] : undefined);
              // const info = await this._service.getSelectInfoByPartNo(res[i]['key'], this.selectItem.cur_site, this.selectItem.cur_plant, this.selectItem.cur_productCate, this.selectItem.cur_customer);
              // info[0]['count'] = res[i]['count'];
              toolTip.push(res[i]['info']);
            }
            this.dataYr = { detail: { vendorYr: res, tooltip: toolTip, defectLoss: def, search_type: 'partNumber' }, preTitle: detail['data']['name'], title: title, legend: legend, titlePie: titlePie, target: targetArr, downloadSelect: downLoadSelect};
            console.log(this.dataYr);
          });
        });
        break;

        case 'predefined':
          if (detail['other'] === 'vendor') {
            downLoadSelect.vendor = detail['data']['name'];
            this._service.getPartNumYrByVendor(this.selectItem.cur_site, this.selectItem.cur_plant, detail['data']['name'], this.selectItem.date_from, this.selectItem.date_to).subscribe(res => {
              this._service.getDefectLossAnalyzeByVendor(this.selectItem.cur_site, this.selectItem.cur_plant, detail['data']['name'], this.selectItem.date_from, this.selectItem.date_to).subscribe(async def => {
                // 根据料号获取相应的YR
                const targetArr = [];
                for (let i = 0; i < res.length; i++) {
                  const yrTarget = await this._service.getTarget('yrTarget', this.selectItem.cur_site, this.selectItem.cur_plant, res[i]['key']);
                  targetArr.push(yrTarget.length > 0 ? yrTarget[0]['yrTarget'] : yrTargetDef.length > 0 ? yrTargetDef[0]['yrTarget'] : undefined);
                  toolTip.push(res[i]['info']);
                }
                this.dataYr = { detail: { vendorYr: res, tooltip: toolTip, defectLoss: def, search_type: 'partNumber' }, preTitle: detail['data']['name'], title: title, legend: legend, titlePie: titlePie, target: targetArr, downloadSelect: downLoadSelect};
                console.log(this.dataYr);
              });
            });
          }

          if (detail['other'] === 'model') {
            downLoadSelect.model = detail['data']['name'];
            this._service.getPartNumYrByModel(this.selectItem.cur_site, this.selectItem.cur_plant, detail['data']['name'], this.selectItem.date_from, this.selectItem.date_to).subscribe(res => {
              this._service.getDefectLossAnalyzeByModel(this.selectItem.cur_site, this.selectItem.cur_plant, detail['data']['name'], this.selectItem.date_from, this.selectItem.date_to).subscribe(async def => {
                // 根据料号获取相应的YR
                // debugger;
                const targetArr = [];
                for (let i = 0; i < res.length; i++) {
                  const yrTarget = await this._service.getTarget('yrTarget', this.selectItem.cur_site, this.selectItem.cur_plant, res[i]['key']);
                  targetArr.push(yrTarget.length > 0 ? yrTarget[0]['yrTarget'] : yrTargetDef.length > 0 ? yrTargetDef[0]['yrTarget'] : undefined);
                  // const info = await this._service.getSelectInfoByPartNo(res[i]['key'], this.selectItem.cur_site, this.selectItem.cur_plant, this.selectItem.cur_productCate, this.selectItem.cur_customer);
                  // info[0]['count'] = res[i]['count'];
                  toolTip.push(res[i]['info']);
                }
                this.dataYr = { detail: { vendorYr: res, tooltip: toolTip, defectLoss: def, search_type: 'partNumber' }, preTitle: detail['data']['name'], title: title, legend: legend, titlePie: titlePie, target: targetArr, downloadSelect: downLoadSelect};
                console.log(this.dataYr);
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
                this.dataYr = {detail: {vendorYr: res, tooltip: toolTip, defectLoss: def, search_type: 'partNumber'}, preTitle: detail['data']['name'], title: title, legend: legend, titlePie: titlePie, target: targetArr, downloadSelect: downLoadSelect};
                console.log(res, this.dataYr);
              });
            });
          }

          break;
    }
  }

  showSubDetailPD(detail, legend, titlePie) {
    const toolTip = [];
    switch (this.selectItem.cur_searchBy) {
      // 顯示彈出層‘料號’
      case 'vendor':
        this._service.getPartNumDrByVendor(this.selectItem.cur_site, this.selectItem.cur_plant, detail['data']['name'], this.selectItem.date_from, this.selectItem.date_to).subscribe(async res => {
          for (let i = 0; i < res.length; i++) {
            toolTip.push(res[i]['info']);
          }
          this.dataDr = { detail: { vendorDr: res, toolTip: toolTip, search_type: 'partNumber' }, preTitle: detail['data']['name'], title: this.ngMaterial, legend: legend, titlePie: titlePie };
        });
        break;
      case 'model':
        this._service.getPartNumDrByModel(this.selectItem.cur_site, this.selectItem.cur_plant, detail['data']['name'], this.selectItem.date_from, this.selectItem.date_to).subscribe(async res => {
          for (let i = 0; i < res.length; i++) {
            toolTip.push(res[i]['info']);
          }
          this.dataDr = { detail: { vendorDr: res, toolTip: toolTip, search_type: 'partNumber' }, preTitle: detail['data']['name'], title: this.ngMaterial, legend: legend, titlePie: titlePie };
        });
        break;

        case 'predefined':
          if (this.selectItem.cur_materialNo) {
            // 如果选择项有料号，则不显示下一层
            return;
          } else if (this.selectItem.cur_model) {
            this._service.getPartNumDrByModel(this.selectItem.cur_site, this.selectItem.cur_plant, detail['data']['name'], this.selectItem.date_from, this.selectItem.date_to).subscribe(async res => {
              for (let i = 0; i < res.length; i++) {
                toolTip.push(res[i]['info']);
              }
              this.dataDr = { detail: { vendorDr: res, toolTip: toolTip, search_type: 'partNumber' }, preTitle: detail['data']['name'], title: this.ngMaterial, legend: legend, titlePie: titlePie };
            });
          } else if (this.selectItem.cur_vendor) {
            this._service.getPartNumDrByVendor(this.selectItem.cur_site, this.selectItem.cur_plant, detail['data']['name'], this.selectItem.date_from, this.selectItem.date_to).subscribe(async res => {
              for (let i = 0; i < res.length; i++) {
                toolTip.push(res[i]['info']);
              }
              this.dataDr = { detail: { vendorDr: res, toolTip: toolTip, search_type: 'partNumber' }, preTitle: detail['data']['name'], title: this.ngMaterial, legend: legend, titlePie: titlePie };
            });
          } else {
            this._service.getPartNumDrByProductName(this.selectItem.cur_site, this.selectItem.cur_plant, detail['data']['name'], this.selectItem.date_from, this.selectItem.date_to).subscribe(async res => {
              for (let i = 0; i < res.length; i++) {
                toolTip.push(res[i]['info']);
              }
              this.dataDr = { detail: { vendorDr: res, toolTip: toolTip, search_type: 'partNumber' }, preTitle: detail['data']['name'], title: this.ngMaterial, legend: legend, titlePie: titlePie };
            });
          }
          break;
    }
  }


  async detailAnalyze(detail, isYrTrend = false) {
    // 呼叫API
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
      date_to: this.selectItem.date_to,
      selectDate: {
        date_from: this.selectItem.date_from,
        date_to: this.selectItem.date_to
      }
    };
    console.log(detail);
    if (!isYrTrend) {
      switch (this.selectItem.cur_searchBy) {
        case 'vendor':
          downLoadSelect.vendor = detail['vendor'];
          this._service.getDefectLossAnalyzeByVendor(this.selectItem.cur_site, this.selectItem.cur_plant, detail['vendor'], this.selectItem.date_from, this.selectItem.date_to, detail['data']['partNumber']).subscribe(res => {
            detail['preTitle'] = detail['data']['partNumber'];
            downLoadSelect.partNumber = detail['preTitle'];
            this.defectLossAnalyze = { detail: detail, drAnalyze: res, downloadSelect: downLoadSelect };
          });
          break;
        case 'model':
          downLoadSelect.model = detail['model'];
          this._service.getDefectLossAnalyzeByModel(this.selectItem.cur_site, this.selectItem.cur_plant, detail['vendor'], this.selectItem.date_from, this.selectItem.date_to, detail['data']['partNumber']).subscribe(res => {
            detail['preTitle'] = detail['data']['partNumber'];
            downLoadSelect.partNumber = detail['preTitle'];
            this.defectLossAnalyze = { detail: detail, drAnalyze: res, downloadSelect: downLoadSelect};
          });
          break;
        case 'partNumber':
          downLoadSelect.partNumber = detail['partNumber'];
          this._service.getDefectLossAnalyzeByPartNo(this.selectItem.cur_site, this.selectItem.cur_plant, detail['partNumber'], this.selectItem.date_from, this.selectItem.date_to).subscribe(res => {
            detail['preTitle'] = detail['partNumber'];
            downLoadSelect.partNumber = detail['preTitle'];
            detail['titlePie'] = this.overSpecAlys;
            this.defectLossAnalyze = { detail: detail, drAnalyze: res, downloadSelect: downLoadSelect};
          });
          break;
        case 'predefined':
            if (this.selectItem.cur_materialNo) {
              downLoadSelect.partNumber = detail['partNumber'];
              this._service.getDefectLossAnalyzeByPartNo(this.selectItem.cur_site, this.selectItem.cur_plant, detail['partNumber'], this.selectItem.date_from, this.selectItem.date_to).subscribe(res => {
                detail['preTitle'] = detail['partNumber'];
                downLoadSelect.partNumber = detail['preTitle'];
                detail['titlePie'] = this.overSpecAlys;
                this.defectLossAnalyze = { detail: detail, drAnalyze: res, downloadSelect: downLoadSelect};
              });
            } else if (this.selectItem.cur_model) {
              downLoadSelect.model = detail['vendor'];
              this._service.getDefectLossAnalyzeByModel(this.selectItem.cur_site, this.selectItem.cur_plant, detail['vendor'], this.selectItem.date_from, this.selectItem.date_to, detail['data']['partNumber']).subscribe(res => {
                detail['preTitle'] = detail['data']['partNumber'];
                downLoadSelect.partNumber = detail['preTitle'];
                this.defectLossAnalyze = { detail: detail, drAnalyze: res, downloadSelect: downLoadSelect};
              });
            } else if (this.selectItem.cur_vendor) {

              downLoadSelect.vendor = detail['vendor'];
              this._service.getDefectLossAnalyzeByVendor(this.selectItem.cur_site, this.selectItem.cur_plant, detail['vendor'], this.selectItem.date_from, this.selectItem.date_to, detail['data']['partNumber']).subscribe(res => {
                detail['preTitle'] = detail['data']['partNumber'];
                downLoadSelect.partNumber = detail['preTitle'];
                this.defectLossAnalyze = { detail: detail, drAnalyze: res, downloadSelect: downLoadSelect };
              });
            } else {
              downLoadSelect.partNumber = detail['data']['partNumber'];
              this._service.getDefectLossAnalyzeByPartNo(this.selectItem.cur_site, this.selectItem.cur_plant, detail['partNumber'], this.selectItem.date_from, this.selectItem.date_to).subscribe(res => {
                detail['preTitle'] = detail['data']['partNumber'];
                downLoadSelect.partNumber = detail['preTitle'];
                detail['titlePie'] = this.overSpecAlys;
                this.defectLossAnalyze = { detail: detail, drAnalyze: res, downloadSelect: downLoadSelect};
              });
            }
            break;
      }
    } else {
      let startMonthDate, endMonthDate;
      switch (this.yrTrendPeriod) {
        case 'day':
          startMonthDate = moment(detail['time']).startOf('day').valueOf();
          endMonthDate = moment(detail['time']).endOf('day').valueOf();
          break;
        case 'week':
          startMonthDate = moment(detail['time']).startOf('isoWeek').valueOf();
          endMonthDate = moment(detail['time']).endOf('isoWeek').valueOf();
          break;
        case 'month':
          startMonthDate = moment(detail['time']).startOf('month').valueOf();
          endMonthDate = moment(detail['time']).endOf('month').valueOf();
          break;
        default:
          break;
      }
      downLoadSelect.date_from = startMonthDate;
      downLoadSelect.date_to = endMonthDate;

      switch (this.yrTrendQueryType.radio) {
        case 'global':
          this._service.getDefectLoass({
            site: this.selectItem.cur_site, plant: this.selectItem.cur_plant, customer: this.selectItem.cur_customer, product: this.selectItem.cur_productCate,
            model: this.selectItem.cur_model, vendor: this.selectItem.cur_vendor, productName: this.selectItem.cur_proName, partNumber: this.selectItem.cur_materialNo
          }, startMonthDate, endMonthDate).subscribe(res => {
            detail['preTitle'] = detail['data']['seriesName'];
            this.defectLossAnalyze = { detail: detail, drAnalyze: res, downloadSelect: downLoadSelect, isYrTrend: isYrTrend };
          });
          break;
        case 'detail':
          this._service.getDefectLoass({
            site: this.selectItem.cur_site, plant: this.selectItem.cur_plant, customer: this.selectItem.cur_customer, product: this.selectItem.cur_productCate,
            vendor: this.yrTrendQueryType.select === 'vendor' ? detail['data']['seriesName'] : this.selectItem.cur_vendor,
            model: this.yrTrendQueryType.select === 'model' ? detail['data']['seriesName'] : this.selectItem.cur_model,
            partNumber: this.yrTrendQueryType.select === 'partNumber' ? detail['data']['seriesName'] : this.selectItem.cur_materialNo,
            productName: this.selectItem.cur_proName
          }, startMonthDate, endMonthDate).subscribe(res => {
            detail['preTitle'] = detail['data']['seriesName'];
            downLoadSelect[this.yrTrendQueryType.select] = detail['preTitle'];
            this.defectLossAnalyze = { detail: detail, drAnalyze: res, downloadSelect: downLoadSelect, isYrTrend: isYrTrend };
          });
          break;
        default:
          break;
      }
    }
  }

  async wrapMaterialYrChart(rawData, title, legend: any[], period) {
    const data_x = []; const data_x_index = []; const data_target = []; const data_yr = []; const data_dayYr = []; const data_nightYr = []; const time_yr = [];
    let lineData = {}; const seriesArray = []; const data_input = []; const day_input = []; const night_input = [];
    const allPeriod = period === 'week' ? 'allWeek' : 'allDay';
    const toolTip_vm = [];
    if (rawData) {
      rawData[allPeriod].forEach((res, index) => {
        if (parseInt(res['count'], 0) !== 0) {
          data_input.push(res['count']);
          data_x.push(res['key'] + (period === 'week' ? `\n${res['week']}` : ''));
          data_x_index.push(index);
        }
      });
      if (this.selectItem.cur_searchBy === 'model') {
        this.yrTrendTarget = await this._service.getTarget('yrTarget', this.selectItem.cur_site, this.selectItem.cur_plant, '*', '*');
      }
      if (this.selectItem.cur_searchBy === 'partNumber') {
        this.yrTrendTarget = await this._service.getTarget('yrTarget', this.selectItem.cur_site, this.selectItem.cur_plant, this.selectItem.cur_model, this.selectItem.cur_materialNo);
      }
      if (this.selectItem.cur_searchBy === 'vendor') {
        this.yrTrendTarget = await this._service.getTarget('yrTarget', this.selectItem.cur_site, this.selectItem.cur_plant, '*', '*');
      }


      if (this.selectItem.cur_searchBy === 'predefined') {
        // 如果只选了品名
        if (this.selectItem.cur_proName && !this.selectItem.cur_vendor && !this.selectItem.cur_model && !this.selectItem.cur_materialNo) {
          this.yrTrendTarget = await this._service.getTarget('yrTarget', this.selectItem.cur_site, this.selectItem.cur_plant, this.selectItem.cur_model, this.selectItem.cur_materialNo);
        } else if (this.selectItem.cur_materialNo) { // 选择了料号
          this.yrTrendTarget = await this._service.getTarget('yrTarget', this.selectItem.cur_site, this.selectItem.cur_plant, this.selectItem.cur_model, this.selectItem.cur_materialNo);
        } else if (this.selectItem.cur_model) { // 选择机种
          this.yrTrendTarget = await this._service.getTarget('yrTarget', this.selectItem.cur_site, this.selectItem.cur_plant, '*', '*');
        } else if (this.selectItem.cur_vendor) { // 选择供应商
          this.yrTrendTarget = await this._service.getTarget('yrTarget', this.selectItem.cur_site, this.selectItem.cur_plant, '*', '*');
        }
      }


      // data_target = rawData['allDay'].map(res => {
      //   return yrTarget[0] ? yrTarget[0]['yrTarget'] : undefined;
      // });
      // data_dayYr = rawData['day'].map(res => {
      //   day_input.push(res['count']);
      //   return res['percent'];
      // });

      // data_nightYr = rawData['night'].map(res => {
      //   night_input.push(res['count']);
      //   return res['percent'];
      // });
      data_x_index.forEach(index => {
        night_input.push(rawData['night'][index]['count']);
        day_input.push(rawData['day'][index]['count']);
        data_dayYr.push(rawData['day'][index]['percent']);
        data_nightYr.push(rawData['night'][index]['percent']);
        data_yr.push(rawData[allPeriod][index]['percent']);
        time_yr.push(rawData[allPeriod][index]['time']);
        // 计算target的 avg
        const avg = this.yrTrendTarget.reduce((sum, cur) => sum + cur['yrTarget'], 0) / this.yrTrendTarget.length;
        data_target.push(isNaN(avg) ? undefined : avg);
      });
      // data_yr = rawData['allDay'].map(res => {
      //   return res['percent'];
      // });
    }
    data_target.forEach((target, index) => {
      toolTip_vm.push({ 'target': target, 'dayYr': data_dayYr[index], 'nightYr': data_nightYr[index], 'yr': data_yr[index] });
    });
    seriesArray.push(
      {
        name: legend[3],
        type: 'line',
        data: data_target,
        itemStyle: {
            borderColor: '#00BCD4',
            borderWidth: 2,
            color: '#00BCD4',
        },
        label: {
          show: false,
          position: 'top',
          color: 'black',
          formatter: '{c}%'
        },
        lineStyle: {
          color: '#00BCD4'
        }
      },
      {
      name: legend[0],
      type: 'line',
      data: data_yr,
      itemStyle: {
        borderColor: '#339933',
        borderWidth: 2,
        color: '#339933'
      },
      label: {
        show: false,
        position: 'top',
        color: 'black',
        formatter: '{c}%'
      },
      lineStyle: {
        color: '#339933'
      }
    },
      {
        name: legend[1],
        type: 'line',
        data: data_dayYr,
        itemStyle: {
          borderColor: '#FFC107',
          borderWidth: 2,
          color: '#FFC107'
        },
        label: {
          show: false,
          position: 'top',
          color: 'black',
          formatter: '{c}%'
        },
        lineStyle: {
          color: '#FFC107'
        }
      }, {
      name: legend[2],
      type: 'line',
      data: data_nightYr,
      itemStyle: {
        borderColor: '#9C27B0',
        borderWidth: 2,
        color: '#9C27B0'
      },
      label: {
        show: false,
        position: 'top',
        color: 'black',
        formatter: '{c}%'
      },
      lineStyle: {
        color: '#9C27B0'
      }
    },
      // 这里line设置的是透明色，不显示不来，只为了tooltip中可以看到
      {
        name: 'Total input',
        type: 'line',
        data: data_input,
        showSymbol: false,
        itemStyle: {
          borderColor: 'rgba(255,255,255,0)',
          borderWidth: 1,
          color: 'rgba(255,255,255,0)'
        },
        label: {
          show: false,
          position: 'top',
          color: 'black'
        },
        lineStyle: {
          color: 'rgba(255,255,255,0)'
        }
      },
      {
        name: (this.dayShift) + ' input',
        type: 'line',
        data: day_input,
        showSymbol: false,
        itemStyle: {
          borderColor: 'rgba(255,255,255,0)',
          borderWidth: 1,
          color: 'rgba(255,255,255,0)'
        },
        label: {
          show: false,
          position: 'top',
          color: 'black'
        },
        lineStyle: {
          color: 'rgba(255,255,255,0)'
        }
      },
      {
        name: this.nightShift + ' input',
        type: 'line',
        data: night_input,
        showSymbol: false,
        itemStyle: {
          borderColor: 'rgba(255,255,255,0)',
          borderWidth: 1,
          color: 'rgba(255,255,255,0)'
        },
        label: {
          show: false,
          position: 'top',
          color: 'black'
        },
        lineStyle: {
          color: 'rgba(255,255,255,0)'
        }
      }
    );
    const dataZoom = [
      {
        type: 'slider',
        show: true,
        xAxisIndex: [0]
      }
    ];
    const data_y = {
      type: 'value',
      axisLabel: {
        formatter: '{value}%'
      },
      min: function (value) {
        return (value.min - 0.1).toFixed(2);
      },
      max: 100
    };
    const formatUnit = true; // tooltip帶上%
    lineData = {
      data_x: data_x,
      series: seriesArray,
      legend: legend,
      dataZoom: dataZoom,
      title: title,
      data_y: data_y,
      toolTip: toolTip_vm,
      formatter: formatUnit,
      time: time_yr
    };
    return lineData;
  }

  async wrapMaterialYrChartByGroup(rawData, title, legend: any[], period) {
    const data_x = []; const data_x_index = []; const data_target = []; const data_yr = []; const time_yr = [];
    let lineData = {}; const seriesArray = []; const data_input = [];
    const lineColor = ['#00BCD4', '#339933', '#FFC107', '#9C27B0', '#61a0a8', '#c23531', '#2f4554', '#d48265', '#91c7ae', '#749f83', '#a274ab', '#d968ae', '#568f5a'];
    const toolTip_vm = [];
    console.log(rawData);
    // debugger;
    if (rawData[0]) {
      rawData[0]['data'].forEach((res, index) => {
        data_x.push(res['key'] + (period === 'week' ? `\n${res['week']}` : ''));
        data_x_index.push(index);
      });
      if (this.yrTrendQueryType.select === 'model') {
        this.yrTrendTarget = await this._service.getTarget('yrTarget', this.selectItem.cur_site, this.selectItem.cur_plant, '*', '*');
      }
      if (this.yrTrendQueryType.select === 'partNumber') {
        this.yrTrendTarget = await this._service.getTarget('yrTarget', this.selectItem.cur_site, this.selectItem.cur_plant, this.selectItem.cur_model, this.selectItem.cur_materialNo);
      }
      if (this.yrTrendQueryType.select === 'vendor') {
        this.yrTrendTarget = await this._service.getTarget('yrTarget', this.selectItem.cur_site, this.selectItem.cur_plant, '*', '*');
      }
      rawData.forEach((res, index) => {
        const data_yr_percent = [];
        const data_input_count = [];
        data_x_index.forEach(idx => {
          data_yr_percent.push(res['data'][idx]['percent']);
          data_input_count.push(res['data'][idx]['count']);
          if (index === 0) {
            time_yr.push(res['data'][idx]['time']);
            // 计算target的 avg
            const avg = this.yrTrendTarget.reduce((sum, cur) => sum + cur['yrTarget'], 0) / this.yrTrendTarget.length;
            data_target.push(isNaN(avg) ? undefined : avg);
          }
        });
        data_yr.push(data_yr_percent);
        data_input.push(data_input_count);
      });
    }
    data_target.forEach((target, index) => {
      const toolTip_obj = { 'target': target };
      legend.forEach((item, idx) => {
        if (idx !== legend.length - 1) {
          toolTip_obj[item] = data_yr[idx][index];
        }
      });
      toolTip_vm.push(toolTip_obj);
    });
    seriesArray.push(
      {
        name: legend[legend.length - 1],
        type: 'line',
        data: data_target,
        itemStyle: {
            borderColor: lineColor[0],
            borderWidth: 2,
            color: lineColor[0],
        },
        label: {
          show: false,
          position: 'top',
          color: 'black',
          formatter: '{c}%'
        },
        lineStyle: {
          color: lineColor[0]
        }
      }
    );
    legend.forEach((item, index) => {
      if (index !== legend.length - 1) {
        seriesArray.push(
          {
            name: `${item}`,
            type: 'line',
            data: data_yr[index],
            itemStyle: {
              borderColor: lineColor[index + 1],
              borderWidth: 2,
              color: lineColor[index + 1]
            },
            label: {
              show: false,
              position: 'top',
              color: 'black',
              formatter: '{c}%'
            },
            lineStyle: {
              color: lineColor[index + 1]
            }
          }
        );
      }
    });
    legend.forEach((item, index) => {
      if (index !== legend.length - 1) {
        seriesArray.push(
          // 这里line设置的是透明色，不显示不来，只为了tooltip中可以看到
          {
            name: `${item} input`,
            type: 'line',
            data: data_input[index],
            showSymbol: false,
            itemStyle: {
              borderColor: 'rgba(255,255,255,0)',
              borderWidth: 1,
              color: 'rgba(255,255,255,0)'
            },
            label: {
              show: false,
              position: 'top',
              color: 'black'
            },
            lineStyle: {
              color: 'rgba(255,255,255,0)'
            }
          }
        );
      }
    });
    const dataZoom = [
      {
        type: 'slider',
        show: true,
        xAxisIndex: [0]
      }
    ];
    const data_y = {
      type: 'value',
      axisLabel: {
        formatter: '{value}%'
      },
      min: function (value) {
        return (value.min - 0.1).toFixed(2);
      },
      max: 100
    };
    const formatUnit = true; // tooltip帶上%
    lineData = {
      data_x: data_x,
      series: seriesArray,
      legend: legend,
      dataZoom: dataZoom,
      title: title,
      data_y: data_y,
      toolTip: toolTip_vm,
      formatter: formatUnit,
      time: time_yr
    };
    console.log(lineData);
    return lineData;
  }

  async wrapMaterialDRPDChar(rowData, title, legend_name, char_width) {
    const data_x = Array(10).fill(''); const data_y = []; const target = [];
    const toolTip = [];
    let barData = {};
    const data_arr = [];
    for (let i = 0; i < rowData.length; i++) {
      // 獲取target預設值
      const res = rowData[i];
      // let drTarget;
      if (this.selectItem.cur_searchBy === 'model') {
        data_x[i] = res['key'];
      }
      if (this.selectItem.cur_searchBy === 'partNumber') {
        toolTip.push(res['info']);
        data_x[i] = res['key'];
        data_x[i] = data_x[i].split('.');
        data_x[i].splice(0, 1);
        data_x[i] = data_x[i].join(',');
        data_x[i] = data_x[i].replace(',', '.');
      }
      if (this.selectItem.cur_searchBy === 'vendor') {
        data_x[i] = res['key'];
      }

      if (this.selectItem.cur_searchBy === 'predefined') {
        // 如果只选了品名
        if (this.selectItem.cur_proName && !this.selectItem.cur_vendor && !this.selectItem.cur_model && !this.selectItem.cur_materialNo) {
          data_x[i] = res['key'];
        } else if (this.selectItem.cur_materialNo) { // 选择了料号
          toolTip.push(res['info']);
          data_x[i] = res['key'];
          data_x[i] = data_x[i].split('.');
          data_x[i].splice(0, 1);
          data_x[i] = data_x[i].join(',');
          data_x[i] = data_x[i].replace(',', '.');
        } else if (this.selectItem.cur_model) { // 选择机种
          data_x[i] = res['key'];
        } else if (this.selectItem.cur_vendor) { // 选择供应商
          data_x[i] = res['key'];
        }
      }



      res['percent'] = parseFloat(res['percent']);
      // 截取後兩段
      data_arr.push({ value: res['percent'].toString().includes('.') ? res['percent'].toFixed(1) : res['percent'], itemStyle: { color: '#fb928e' } });
      let series_data;
      series_data = {
        value: res['percent'].toString().includes('.') ? res['percent'].toFixed(1) : res['percent'],
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
          fontSize: 10,
          color: 'white'
        }
      };
      data_y.push(series_data);
    }

    barData = {
      data_x: data_x,
      data_y: data_y,
      target: [],
      target_name: undefined,
      title: title,
      legend: legend_name,
      width: char_width,
      height: '14vw',
      toolTip: toolTip,
      search_type: 'vendor',
      data_arr: data_arr
    };
    // console.log('echarts 数据\n', barData);
    return barData;
  }

  async warpMaterialYrBarChart(rawData, title, legend, char_width) {
    const data_x = Array(10).fill(''); const data_yr = []; const target = []; let yrTarget;
    let barData = {};
    const toolTip = [];
    const toolTip_vm = [];
    const data_arr = []; // 用于画图形图图顶的资料
    let other; // other 做为选择自定义时到底选择了供应商、机种、料号、品名中的哪一个
    // const yrTarget = await this._service.getYrTarget(this.cur_site, this.cur_plant, this.cur_model, this.cur_materialNo);
    if (rawData) {
      // debugger;
      // data_x = rawData['key'];
      // await rawData.map(async res => {
      const yrTargetDef = await this._service.getTarget('yrTarget', this.selectItem.cur_site, this.selectItem.cur_plant, '*', '*');
      for (let i = 0; i < rawData.length; i++) {
        const res = rawData[i];
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
          data_x[i] = rawData[i]['key'];
          if (rawData[i]['key'].includes('.') && data_x[i].split('.').length === 3) {
            data_x[i] = data_x[i].split('.');
            data_x[i].splice(0, 1);
            data_x[i] = data_x[i].join(',');
            data_x[i] = data_x[i].replace(',', '.');
          } else {
            data_x[i] = rawData[i]['key'];
            toolTip_vm.push(rawData[i]);
          }
        }


        else if (this.selectItem.cur_searchBy === 'partNumber') {
          // const info = await this._service.getSelectInfoByPartNo(res['key']);
          // res['info'].map(info_item => info_item['count'] = res['count']);
          // info[0]['count'] = res['count'];
          toolTip.push(res['info']);
          data_x[i] = rawData[i]['key'];
          if (rawData[i]['key'].includes('.') && data_x[i].split('.').length === 3) {
            data_x[i] = data_x[i].split('.');
            data_x[i].splice(0, 1);
            data_x[i] = data_x[i].join(',');
            data_x[i] = data_x[i].replace(',', '.');
          }
        } else {
          data_x[i] = rawData[i]['key'];
          toolTip_vm.push(rawData[i]);
        }
      let series_data;
      if (res['percent'] < res['target']) {
        data_arr.push({value: res['percent'].toString().includes('.') ?  res['percent'].toFixed(1) : res['percent'], itemStyle: {color: '#fb928e'}});
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
      data_yr.push(series_data);
      }
    }
    barData = {
      data_x: data_x,
      data_y: data_yr,
      target: target,
      title: title,
      legend: legend,
      target_name: 'target',
      width: char_width,
      height: '14vw',
      data_arr: data_arr,
      toolTip: toolTip,
      toolTip_vm: toolTip_vm,
      search_type: this.selectItem.cur_searchBy,
      other: other
    };
    console.log(barData);
    return barData;
  }






  wrapMaterialProductYrAnalyzeChart(rawData, title, char_width, series_name) {
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
    const dataPie = [];
    let pieData;
    for (const key in rawData) {
      if (rawData.hasOwnProperty(key)) {
        // dataPie.push({name: key, value: rawData[key]});
        if (key === 'sizeFailCount') {
          if (rawData[key] > 0) {
            dataPie.push({tag: 'size', name: this.dimension, value: rawData[key], itemStyle: { color: '#34B2CA' } });
          }
        }
        if (key === 'deformationFailCount') {
          if (rawData[key] > 0) {
            dataPie.push({tag: 'deformation', name: this.deformaion, value: rawData[key], itemStyle: { color: '#F6CE10' } });
          }
        }
        if (key === 'visualizationFailCount') {
          if (rawData[key] > 0) {
            dataPie.push({tag: 'appearance', name: this.outLook, value: rawData[key], itemStyle: { color: '#D23E96' } });
          }
        }
        // count
        if (key === 'countFailCount') {
          if (rawData[key] > 0) {
            dataPie.push({tag: 'count', name: this.transCount, value: rawData[key], itemStyle: { color: '#F6912D' } });
          }
        }
      }
      // Measurement
      if (key === 'measurementFailCount') {
        if (rawData[key] > 0) {
          dataPie.push({tag: 'measurement', name: this.measurement, value: rawData[key], itemStyle: { color: '#8459A4' } });
        }
      }
    }

    // 良率看板  over spec分析
    const seriesPie = {
      name: this.overSpecAlys,
      type: 'pie',
      radius: '65%',
      center: ['50%', '60%'],
      data: dataPie,
      label: {
        show: true,
        formatter: '{b}:{c} ({d}%)',
        position: 'inner'
      },
    };
    pieData = {
      deleteExcelHeader: true,
      downloadSelect: downLoadSelect,
      title: title,
      series_name: series_name,
      series: seriesPie,
      width: char_width,
      height: '14vw',
      display: 'inline-block'
    };
    return pieData;
  }

  onChangeYrTrendQueryType(value) {
    this.yrTrendQueryType = value;
    this.onChangeYrTrendPeriod(this.yrTrendPeriod);
  }

  onChangeYrTrendPeriod(value) {
    this.yrTrendPeriod = value;
    let legend;
    switch (this.yrTrendQueryType.radio) {
      case 'global':
        legend = ['Total Y/R', (this.dayShift) + ' Y/R', (this.nightShift)  + ' Y/R', 'Target'];
        switch (this.yrTrendPeriod) {
          case 'day':
            this._service.getYrTrend({
              site: this.selectItem.cur_site, plant: this.selectItem.cur_plant, customer: this.selectItem.cur_customer, product: this.selectItem.cur_productCate,
              model: this.selectItem.cur_model, vendor: this.selectItem.cur_vendor, productName: this.selectItem.cur_proName, partNumber: this.selectItem.cur_materialNo
            },
            this.selectItem.date_from, this.selectItem.date_to).subscribe(async res => {
              this.materialProductYrLineData = await this.wrapMaterialYrChart(res, this.supYrTrend, legend, this.yrTrendPeriod);
            });
            break;
          case 'week':
            this._service.getWeekTrend({
              site: this.selectItem.cur_site, plant: this.selectItem.cur_plant, customer: this.selectItem.cur_customer, product: this.selectItem.cur_productCate,
              model: this.selectItem.cur_model, vendor: this.selectItem.cur_vendor, productName: this.selectItem.cur_proName, partNumber: this.selectItem.cur_materialNo
            },
            this.selectItem.date_from, this.selectItem.date_to).subscribe(async res => {
              this.materialProductYrLineData = await this.wrapMaterialYrChart(res, this.supYrTrend, legend, this.yrTrendPeriod);
            });
            break;
          case 'month':
            this._service.getMonthShiftTrend({
              site: this.selectItem.cur_site, plant: this.selectItem.cur_plant, customer: this.selectItem.cur_customer, product: this.selectItem.cur_productCate,
              model: this.selectItem.cur_model, vendor: this.selectItem.cur_vendor, productName: this.selectItem.cur_proName, partNumber: this.selectItem.cur_materialNo
            },
            this.selectItem.date_from, this.selectItem.date_to).subscribe(async res => {
              this.materialProductYrLineData = await this.wrapMaterialYrChart(res, this.supYrTrend, legend, this.yrTrendPeriod);
            });
            break;
          default:
            break;
        }
        break;
      case 'detail':
        this._service.getTrendByGroup(
        this.yrTrendQueryType.select, this.yrTrendPeriod,
        {
          site: this.selectItem.cur_site, plant: this.selectItem.cur_plant, customer: this.selectItem.cur_customer, product: this.selectItem.cur_productCate,
          model: this.selectItem.cur_model, vendor: this.selectItem.cur_vendor, productName: this.selectItem.cur_proName, partNumber: this.selectItem.cur_materialNo
        },
        this.selectItem.date_from, this.selectItem.date_to).subscribe(async res => {
          // 缺陷看板提的需求 添加 Y/R
          legend = res.map(item => item.key + ' YR');
          // 缺陷看板提的需求 要添加 Y/R
          legend.push('Y/R Target');
          this.materialProductYrLineData = await this.wrapMaterialYrChartByGroup(res, this.supYrTrend, legend, this.yrTrendPeriod);
        });
        break;
      default:
        break;
    }
  }





  ngOnDestroy(): void {
     this.destroy$.next();
     this.destroy$.complete();
  }

}
