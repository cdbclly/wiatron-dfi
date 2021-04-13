// import { CloseRateAutoTrackServiceService } from './../manage-board/pages/close-rate-auto-track/close-rate-auto-track-service.service';
import { ExcelToolsService } from './../../imqm-common/service/excel-tools.service';
import { ToolkitService } from 'app/mrr/imqm/imqm-common/service';
import { SelectItems } from './../../imqm-common/toolKits/model';
import { getSelectLocal } from 'app/mrr/imqm/imqm-common/toolKits/autoSelect';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NzI18nService, zh_TW, en_US } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { FalseDataService } from './false-data.service';

@Component({
  selector: 'app-false-data',
  templateUrl: './false-data.component.html',
  styleUrls: ['./false-data.component.scss']
})
export class FalseDataComponent implements OnInit {

  require = false;
  isEdit = true; // 显示close.reject btn
  abnormalList = [];
  traceBackList = [];
  earlyWarnList = [];
  allFormsList = [];
  cur_searchBy;
  formNos;
  selectItem: SelectItems;
  subject = 'fakeData';
  curTabs = 0;
  subFormsList; // 第一層彈出框的所有資料

  $destroy = new Subject();
  switchValue = false;
  constructor(
    private _service: FalseDataService,
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
        // if (this.formNos && this.cur_searchBy) {
        //   this.curTabs = 1;
        //   this.query();
        // }
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
      this.formNos = params['formNos'];
    }


    if (this.formNos) {
      // 根據單號查詢
      this.abnormalList = await this._service.getRawDataBySN(this.formNos);
      console.log(this.abnormalList);
    } else {
      this.abnormalList = await this._service.getFormList(this.toolKit.assembleSelectObject(params['cur_site'],
        params['cur_factory'], params['cur_productCate'], params['cur_customer'], params['cur_model'], params['cur_vendor'],
        params['cur_proName'], params['cur_materialNo']), Math.ceil(params['date_from'] / 1000), Math.ceil(params['date_to'] / 1000));
      this.abnormalList.forEach(element => {
        element['objName'] = 'fakeData';
        element['expand'] = false;
      });
    }

    this.abnormalList.forEach(element => {
      element['objName'] = 'fakeData';
      element['expand'] = false;
    });

    allFormsList.push(...this.abnormalList);
    this.allFormsList = allFormsList; // for ngOnchanges
  }


  async showDetail(form) {
    console.log(form);
    if (form['objName'] === 'fakeData') {
      const result = await this._service.getRawDataBySN(form['number']);

      const res = result['rawData'];
      const tempData = JSON.parse(res[0]['rawData']);
      tempData['headerField'] = result['headerField'];
      form['type'] = 'fakeData';
      this.subFormsList = { form: form, rawData: JSON.stringify(tempData), date: new Date().getTime() };

      // this.subFormsList = {form: form, rawData: res[0]['rawData'], date: new Date().getTime()};
    }

  }

  closeForm(detail) {
    if (detail['type'] === 'fakeData') {
      this._service.closeForm(detail['formId']).subscribe(res => {
        this.allFormsList.forEach(element => {
          if (element['number'] === detail['formId']) {
            element['status'] = 'close';
          }
        });
        console.log(res);
      });
    }
  }

  rejectForm(detail) {
    if (detail['type'] === 'fakeData') {
      this._service.rejectForm(detail['formId']).subscribe(res => {
        this.allFormsList.forEach(element => {
          if (element['number'] === detail['formId']) {
            element['status'] = 'open';
          }
        });
        console.log(res);
      });
    }
  }

  downloadData() {
    if (this.allFormsList.length > 0) {
      const downloadDatas = this.allFormsList.map(res => {
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

  // chooseNoClose() {
  //   this.allFormsList = this.allFormsList.filter(res => res.status !== 'close')
  // }

  switchChange(data) {
    if (data) {
      this.allFormsList = this.allFormsList.filter(res => res.status !== 'close')
    } else {
      const lastSelectItem = getSelectLocal(this.subject);
      if (lastSelectItem && lastSelectItem[this.subject]) {
        this.query(lastSelectItem[this.subject]);
      }
    }
  }
}
