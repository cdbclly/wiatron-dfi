import { ExceljsService } from './../../imqm-common/service/exceljs.service';
import { getSelectLocal } from 'app/mrr/imqm/imqm-common/toolKits/autoSelect';
import { NzI18nService, en_US, zh_TW, NzMessageService } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';
import { SelectItems } from './../../imqm-common/toolKits/model';
import { DownloadRawdataService } from './download-rawdata.service';
import { Component, OnInit } from '@angular/core';
import { takeUntil, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { max } from 'moment';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-download-rawdata',
  templateUrl: './download-rawdata.component.html',
  styleUrls: ['./download-rawdata.component.scss']
})
export class DownloadRawdataComponent implements OnInit {
  subject = 'downloadRowdata';
  require = false;
  rawData;
  subFormsList;
  headerWidth;
  cancelOK = false;
  footer = null;
  selectItem: SelectItems;
  destroy$ = new Subject();
  trans: object = {};
  scrollConfig;
  currentIndex = 1;
  rawDataSizeSpec;
  rawDataDefSpec;
  dimension: string; // 尺寸
  insepectResult: string; // 检验结果
  snNumber: string; // 产品条码
  dateString: string; // 日期
  deformation: string; // 变形度
  allData = [];
  overSpec: string;
  isShow = true;
  upperAndLower = []; // 上下限
  newRawData = [];
  tableContent = [];
  constructor(
    private service: DownloadRawdataService,
    private translate: TranslateService,
    private nzI18nService: NzI18nService,
    private messageService: NzMessageService,
    private datePipe: DatePipe,
    public exceljs: ExceljsService
  ) {

    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(cur => {
      this.translate.get(['imq-mt-downloadRawdata', 'imq-dimension', 'imq-inspectResult', 'imq-snNumber', 'imq-yr-date', 'imq-deformation', 'imq-menu-downloadrawdata',
        'imq-plant', 'imq-product', 'imq-customer', 'imq-supplier', 'imq-model', 'imq-proName', 'imq-partNumber']).subscribe(res => {
          this.trans['errorTime'] = res['imq-mt-downloadRawdata'];
          this.dimension = res['imq-dimension'];
          this.snNumber = res['imq-snNumber'];
          this.insepectResult = res['imq-inspectResult'];
          this.dateString = res['imq-yr-date'];
          this.deformation = res['imq-deformation'];
          this.overSpec = res['imq-menu-downloadrawdata'];

          this.trans['plant'] = res['imq-plant'];
          this.trans['product'] = res['imq-product'];
          this.trans['customer'] = res['imq-customer'];
          this.trans['supplier'] = res['imq-supplier'];
          this.trans['model'] = res['imq-model'];
          this.trans['proName'] = res['imq-proName'];
          this.trans['partNumber'] = res['imq-partNumber'];

          if (cur.lang === 'en') {
            this.nzI18nService.setLocale(en_US);
          } else {
            this.nzI18nService.setLocale(zh_TW);
          }
          // this.ngOnInit();
        });
    });

  }

  ngOnInit() {
    this.translate.get(['imq-mt-downloadRawdata', 'imq-dimension', 'imq-inspectResult', 'imq-snNumber', 'imq-yr-date', 'imq-deformation', 'imq-menu-downloadrawdata',
      'imq-plant', 'imq-product', 'imq-customer', 'imq-supplier', 'imq-model', 'imq-proName', 'imq-partNumber']).subscribe(res => {
        this.trans['errorTime'] = res['imq-mt-downloadRawdata'];
        this.trans['errorTime'] = res['imq-mt-downloadRawdata'];
        this.dimension = res['imq-dimension'];
        this.snNumber = res['imq-snNumber'];
        this.insepectResult = res['imq-inspectResult'];
        this.dateString = res['imq-yr-date'];
        this.deformation = res['imq-deformation'];
        this.overSpec = res['imq-menu-downloadrawdata'];

        this.trans['plant'] = res['imq-plant'];
        this.trans['product'] = res['imq-product'];
        this.trans['customer'] = res['imq-customer'];
        this.trans['supplier'] = res['imq-supplier'];
        this.trans['model'] = res['imq-model'];
        this.trans['proName'] = res['imq-proName'];
        this.trans['partNumber'] = res['imq-partNumber'];

        const lastSelectItem = getSelectLocal(this.subject);
        if (lastSelectItem) {
          this.query(lastSelectItem[this.subject]);
        }
      });
  }


  async query(params) {
    if (params) {
      this.selectItem = params;
      if (this.selectItem.date_to - this.selectItem.date_from > 2678400000) {
        this.messageService.create('error', this.trans['errorTime']);
      } else {
        const data = {
          site: this.selectItem.cur_site, plant: this.selectItem.cur_plant, customer: this.selectItem.cur_customer, product: this.selectItem.cur_productCate,
          model: this.selectItem.cur_model, vendor: this.selectItem.cur_vendor, productName: this.selectItem.cur_proName, partNumber: this.selectItem.cur_materialNo
        };
        this.service.getRawdataList(data, this.selectItem.date_from, this.selectItem.date_to).subscribe(res => {
          console.log(res)
          this.newRawData = [];
          if (res.length === 0 || res['rawData'].length === 0) {
            return;
          }
          this.rawData = res['rawData'][0]['_source'];
          this.allData = [];
          this.allData = res;
          // 新的数据结构对应的解析
          // table的表头测试项数据
          const headerDic = this.allData['headerField'];
          // table 内容的数据
          const tablContenteData = this.allData['rawData'];

          this.newRawData = this.exceljs.getUpperLimitData(headerDic, tablContenteData);
          // console.log('整理好的数据 \n', this.newRawData)
          // console.log('测试项名称  ---\n', this.newRawData['testItem']);
          const length = (this.newRawData['testItem'].length * 100 + 200) + 'px';
          this.scrollConfig = { x: length, y: '700px' };
          this.upperAndLower = [];
          for (const item of this.newRawData['upperLower']) {
            this.upperAndLower.push.apply(this.upperAndLower, item.split('    |    '));
          }
          this.tableContent = [];
          for (const item of this.newRawData['tableContent']) {
            this.tableContent.push(item.slice(3));
          }
        });
      }
    }
  }


  downloadTotal(title?) {
    // 下载的表头数据
    const headerData = [
      [this.snNumber, this.dateString, this.insepectResult],
      [this.snNumber, this.dateString, this.insepectResult],
      [this.snNumber, this.dateString, this.insepectResult]
    ];

    for (let i = 0; i < headerData.length; i ++) {
      if (i === 0) {
        headerData[i].push.apply(headerData[i], this.newRawData['testItem']);
      } else if (i === 1){
        headerData[i].push.apply(headerData[i], this.newRawData['upperLower']);
      } else {
        headerData[i].push.apply(headerData[i], this.newRawData['machineId']);
      }
    }

    // 筛选条件数组
    const seletArr = [
      ['Site', this.rawData['site'], this.trans['plant'], this.rawData['plant'], this.trans['product'], this.rawData['product']],
      [this.trans['customer'], this.rawData['customer'], this.trans['supplier'], this.rawData['vendor'], this.trans['model'], this.rawData['model']],
      [this.trans['proName'], this.rawData['productName'], this.trans['partNumber'], this.rawData['partNumber'], 'Shift', this.rawData['shift']]
    ];
    // 头部 指定的不需要合并的单元格
    const constHeaderArray = ['A4:A6', 'B4:B6', 'C4:C6'];
    // 内容 指定的不需要合并的单元格
    const constContentArray = ['A7:A7', 'B7:B7', 'C7:C7'];
    this.exceljs.export(seletArr, headerData, this.newRawData['tableContent'], constHeaderArray, constContentArray, this.overSpec, 0);
  }
}
