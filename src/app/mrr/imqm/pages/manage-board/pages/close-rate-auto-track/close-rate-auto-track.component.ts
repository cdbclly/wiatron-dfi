import { Component, OnInit, OnDestroy } from '@angular/core';
import { CloseRateAutoTrackServiceService } from './close-rate-auto-track-service.service';
import { ToolkitService, ExcelToolsService } from '../../../../imqm-common/service';
import { Router, ActivatedRoute } from '@angular/router';
import { SelectItems } from '../../../../imqm-common/toolKits/model';
import { getSelectLocal } from '../../../../imqm-common/toolKits/autoSelect';
import { NzI18nService, zh_TW, en_US } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-close-rate-auto-track',
  templateUrl: './close-rate-auto-track.component.html',
  styleUrls: ['./close-rate-auto-track.component.scss']
})
export class CloseRateAutoTrackComponent implements OnInit, OnDestroy {

  require = false;
  isEdit = true; // 显示close.reject btn
  abnormalList = [];
  traceBackList = [];
  earlyWarnList = [];
  allFormsList = [];
  cur_searchBy;
  formNos;
  selectItem: SelectItems;
  subject = 'autoTrack';
  curTabs = 0;
  subFormsList; // 第一層彈出框的所有資料

  $destroy = new Subject();

  constructor(private _service: CloseRateAutoTrackServiceService,
  private toolKit: ToolkitService,
  private router: Router,
  private activatedRoute: ActivatedRoute,
  private excelService: ExcelToolsService,
  private nzI18nService: NzI18nService,
  private translate: TranslateService
  ) {
    this.translate.onLangChange.pipe(takeUntil(this.$destroy)).subscribe(lang => {
      this.activatedRoute.queryParams.subscribe(queryPars => {
        console.log(queryPars);
        this.formNos = queryPars.formNos;
        if (lang.lang === 'en') {
          this.nzI18nService.setLocale(en_US);
        } else {
          this.nzI18nService.setLocale(zh_TW);
        }
        this.cur_searchBy = queryPars.type;
        if (this.formNos && this.cur_searchBy) {
          this.curTabs = 1;
          this.query();
        }
      });
    });
  }

  ngOnInit() {
    const lastSelectItem = getSelectLocal(this.subject);
    if (lastSelectItem && lastSelectItem[this.subject]) {
      this.query(lastSelectItem[this.subject]);
    }
  }

  async query(params?) {
    console.log(params);
    const allFormsList = [];
    // Call API
    this.abnormalList = [];
    this.earlyWarnList = [];
    this.traceBackList = [];
    if (params) {
      this.cur_searchBy = params['cur_searchBy'];
      this.formNos = params['formNos'];
    }
    switch (this.cur_searchBy) {
      case 'abnormal':
         if (this.formNos) {
           // 根據單號查詢
           this.abnormalList = await this._service.getAbnormalRawDataBySN(this.formNos);
           console.log(this.abnormalList);
         } else {
          this.abnormalList = await this._service.getAbnormalFormList(this.toolKit.assembleSelectObject(params['cur_site'],
          params['cur_factory'], params['cur_productCate'], params['cur_customer'], params['cur_model'], params['cur_vendor'],
          params['cur_proName'], params['cur_materialNo']), Math.ceil(params['date_from'] / 1000), Math.ceil(params['date_to'] / 1000));
          this.abnormalList.forEach(element => {
          element['objName'] = 'abnormal';
          element['expand'] = false;
        });
         }
         break;
      case 'earlyWarn':
        if (this.formNos) {
          this.earlyWarnList = await this._service.getEarlyWarnRawDataBySN(this.formNos);
        } else {
          this.earlyWarnList = await this._service.getEarlyWarnFormList(this.toolKit.assembleSelectObject(params['cur_site'],
          params['cur_factory'], params['cur_productCate'], params['cur_customer'], params['cur_model'], params['cur_vendor'],
          params['cur_proName'], params['cur_materialNo']), Math.ceil(params['date_from'] / 1000), Math.ceil(params['date_to'] / 1000));
          this.earlyWarnList.forEach(element => {
          element['objName'] = 'earlyWarn';
          element['expand'] = false;
          });
        }
        break;
      case 'traceBack':
        if (this.formNos) {
          this.traceBackList = await this._service.getTraceBackRawDataBySN(this.formNos);
        } else {
          this.traceBackList = await this._service.getTraceBackFormList(this.toolKit.assembleSelectObject(params['cur_site'],
          params['cur_factory'], params['cur_productCate'], params['cur_customer'], params['cur_model'], params['cur_vendor'],
          params['cur_proName'], params['cur_materialNo']), Math.ceil(params['date_from'] / 1000), Math.ceil(params['date_to'] / 1000));
          this.traceBackList.forEach(element => {
          element['objName'] = 'traceBack';
          element['expand'] = false;
          });
        }
        break;
    }

    if (!this.cur_searchBy) {
      this.abnormalList = await this._service.getAbnormalFormList(this.toolKit.assembleSelectObject(params['cur_site'],
    params['cur_factory'], params['cur_productCate'], params['cur_customer'], params['cur_model'], params['cur_vendor'],
    params['cur_proName'], params['cur_materialNo']), Math.ceil(params['date_from'] / 1000), Math.ceil(params['date_to'] / 1000));
      this.earlyWarnList = await this._service.getEarlyWarnFormList(this.toolKit.assembleSelectObject(params['cur_site'],
    params['cur_factory'], params['cur_productCate'], params['cur_customer'], params['cur_model'], params['cur_vendor'],
    params['cur_proName'], params['cur_materialNo']), Math.ceil(params['date_from'] / 1000), Math.ceil(params['date_to'] / 1000));
      this.traceBackList = await this._service.getTraceBackFormList(this.toolKit.assembleSelectObject(params['cur_site'],
    params['cur_factory'], params['cur_productCate'], params['cur_customer'], params['cur_model'], params['cur_vendor'],
    params['cur_proName'], params['cur_materialNo']), Math.ceil(params['date_from'] / 1000), Math.ceil(params['date_to'] / 1000));
    }
    this.abnormalList.forEach(element => {
      element['objName'] = 'abnormal';
      element['expand'] = false;
    });
    this.earlyWarnList.forEach(element => {
      element['objName'] = 'earlyWarn';
      element['expand'] = false;
    });
    this.traceBackList.forEach(element => {
      element['objName'] = 'traceBack';
      element['expand'] = false;
    });
    allFormsList.push(...this.abnormalList);
    allFormsList.push(...this.earlyWarnList);
    allFormsList.push(...this.traceBackList);
    this.allFormsList = allFormsList; // for ngOnchanges
  }

  async showDetail(form) {
    console.log(form);
    if (form['objName'] === 'earlyWarn') {
      // 結案率自動追蹤 预警 详细按钮点开传入的数据
      const res = await this._service.getEarlyWarnRawDataBySN(form['number']);
      this.subFormsList = {form: form, rawData: res[0]['rawData'], date: new Date().getTime()};
    }
    if (form['objName'] === 'abnormal') {
      const result = await this._service.getAbnormalRawDataBySN(form['number']);

      const res = result['rawData'];
      const tempData = JSON.parse(res[0]['rawData']);
      tempData['headerField'] = result['headerField'];
      this.subFormsList = {form: form, rawData: JSON.stringify(tempData), date: new Date().getTime()};

      // this.subFormsList = {form: form, rawData: res[0]['rawData'], date: new Date().getTime()};
    }
    if (form['objName'] === 'traceBack') {
      const result = await this._service.getTraceBackRawDataBySN(form['number']);

      const res = result['rawData'];
      const tempData = JSON.parse(res[0]['rawData']);
      tempData[0]['headerField'] = result['headerField'];
      form['sn'] = res[0]['unitSerialNumber'];
      this.subFormsList = {form: form, rawData: JSON.stringify(tempData), date: new Date().getTime()};

      // this.subFormsList = {form: form, rawData: res[0]['rawData'], date: new Date().getTime()};
    }
  }

  closeForm(detail) {
    if (detail['type'] === 'abnormal') {
      this._service.closeAbnormalForm(detail['formId']).subscribe(res => {
        this.allFormsList.forEach(element => {
          if (element['number'] === detail['formId']) {
            element['status'] = 'close';
          }
        });
        console.log(res);
      });
    }
    if (detail['type'] === 'earlyWarn') {
      this._service.closeEarlyWarnForm(detail['formId']).subscribe(res => {
        this.allFormsList.forEach(element => {
          if (element['number'] === detail['formId']) {
            element['status'] = 'close';
          }
        });
        console.log(res);
      });
    }
    if (detail['type'] === 'traceBack') {
      this._service.closeTraceBackForm(detail['formId']).subscribe(res => {
        this.allFormsList.forEach(element => {
          if (element['number'] === detail['formId']) {
            element['status'] = 'close';
          }
        });
        // console.log(res, this.allFormsList);
      });
    }
  }

  rejectForm(detail) {
    if (detail['type'] === 'abnormal') {
      this._service.rejectAbnormalForm(detail['formId']).subscribe(res => {
        this.allFormsList.forEach(element => {
          if (element['number'] === detail['formId']) {
            element['status'] = 'open';
          }
        });
        console.log(res);
      });
    }
    if (detail['type'] === 'earlyWarn') {
      this._service.rejectEarlyWarnForm(detail['formId']).subscribe(res => {
        this.allFormsList.forEach(element => {
          if (element['number'] === detail['formId']) {
            element['status'] = 'open';
          }
        });
        console.log(res);
      });
    }
    if (detail['type'] === 'traceBack') {
      this._service.rejectTraceBackForm(detail['formId']).subscribe(res => {
        this.allFormsList.forEach(element => {
          if (element['number'] === detail['formId']) {
            element['status'] = 'open';
          }
        });
      });
    }
  }

  downloadData() {
    if (this.allFormsList.length > 0) {
      const downloadDatas = this.allFormsList.map (res => {
        return {
          '单号': res['number'],
          '状态': res['status'],
          '类型': res['objName']
        };
      });
      this.excelService.exportAsExcelFile(JSON.parse(JSON.stringify(downloadDatas)), '表单list');
    }
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.$destroy.next();
    this.$destroy.complete();
  }
}
