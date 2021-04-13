import { ExceljsService } from './../../../service/exceljs.service';
import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-forms-item-fake',
  templateUrl: './forms-item-fake.component.html',
  styleUrls: ['./forms-item-fake.component.scss']
})
export class FormsItemFakeComponent implements OnInit {

  @Input() rawData;
  @Input() allData;
  @Input() seriesHeadWidth: any[];
  scrollConfig;
  curList;
  initLoading = true; // bug
  loadingMore = false;
  rawDataSizeSpec = []; // 显示处理过后的rawData
  rawDataDefSpec = [];
  currentIndex = 1; // table 当前 page index
  // 翻译
  dimension: string; // 尺寸
  insepectResult: string; // 检验结果
  snNumber: string; // 产品条码
  dateString: string; // 日期
  deformation: string; // 变形度
  closeR: string;
  overSpec: string;
  urlString: string;
  trans: object = {};
  newRawData = [];
  upperAndLower = [];
  tableContent = [];
  downLoadTitle: string;

  isVisible = false
  footer = null;
  cancelOK = false;

  constructor(
    public translate: TranslateService,
    private datePipe: DatePipe,
    public exceljs: ExceljsService
  ) {
    this.translate.get(['imq-snNumber', 'imq-yr-date', 'imq-inspectResult', 'imq-dimension', 'imq-deformation', 'imq-closeR-autoTrace', 'imq-menu-overSpec',
    'imq-plant', 'imq-product', 'imq-customer', 'imq-supplier', 'imq-model', 'imq-proName', 'imq-partNumber']).subscribe(res => {
      this.snNumber = res['imq-snNumber'];
      this.dateString = res['imq-yr-date'];
      this.insepectResult = res['imq-inspectResult'];
      this.dimension = res['imq-dimension'];
      this.deformation = res['imq-deformation'];
      this.closeR = res['imq-closeR-autoTrace'];
      this.overSpec = res['imq-menu-overSpec'];

      this.trans['plant'] = res['imq-plant'];
      this.trans['product'] = res['imq-product'];
      this.trans['customer'] = res['imq-customer'];
      this.trans['supplier'] = res['imq-supplier'];
      this.trans['model'] = res['imq-model'];
      this.trans['proName'] = res['imq-proName'];
      this.trans['partNumber'] = res['imq-partNumber'];
    });
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes['rawData']);
    console.log('这里的rawData就是点击放大镜要下载的数据\n', this.rawData);

    this.downLoadTitle = this.allData['number'];
    this.loadingMore = false;
    this.initLoading = false;


    this.allData = [];
    this.allData = this.rawData;
    // 新的数据结构对应的解析
    // table的表头测试项数据
    const headerDic = this.allData['headerField'];
    // table 内容的数据
    const tablContenteData = this.allData['RawData'];

    this.newRawData = this.exceljs.getUpperLimitData(headerDic, tablContenteData, 1);
    // console.log('整理好的数据 \n', this.newRawData)
    // console.log('测试项名称  ---\n', this.newRawData['testItem']);
    const length = (this.newRawData['testItem'].length * 100 + 200) + 'px';
    this.scrollConfig = { x: length, y: '700px' };
    console.log(this.scrollConfig)
    this.upperAndLower = [];
    for (const item of this.newRawData['upperLower']) {
      this.upperAndLower.push.apply(this.upperAndLower, item.split('    |    '));
    }
    this.tableContent = [];
    for (const item of this.newRawData['tableContent']) {
      this.tableContent.push(item.slice(3));
    }
  }

  downloadTotal(title) {
    // 下载的表头数据
    const headerData = [
      [this.snNumber, this.dateString, this.insepectResult],
      [this.snNumber, this.dateString, this.insepectResult],
      [this.snNumber, this.dateString, this.insepectResult]
    ];

    for (let i = 0; i < headerData.length; i++) {
      if (i === 0) {
        headerData[i].push.apply(headerData[i], this.newRawData['testItem']);
      } else if (i === 1) {
        headerData[i].push.apply(headerData[i], this.newRawData['upperLower']);
      } else {
        headerData[i].push.apply(headerData[i], this.newRawData['machineId']);
      }
    }
    const tempSelect = this.allData['RawData'][0];
    // 筛选条件数组
    const seletArr = [
      ['Site', tempSelect['site'], this.trans['plant'], tempSelect['plant'], this.trans['product'], tempSelect['product']],
      [this.trans['customer'], tempSelect['customer'], this.trans['supplier'], tempSelect['vendor'], this.trans['model'], tempSelect['model']],
      [this.trans['proName'], tempSelect['productName'], this.trans['partNumber'], tempSelect['partNumber'], 'Shift', tempSelect['shift']]
    ];
    // 头部 指定的不需要合并的单元格
    const constHeaderArray = ['A4:A6', 'B4:B6', 'C4:C6'];
    // 内容 指定的不需要合并的单元格
    const constContentArray = ['A7:A7', 'B7:B7', 'C7:C7'];
    this.exceljs.export(seletArr, headerData, this.newRawData['tableContent'], constHeaderArray, constContentArray, this.downLoadTitle);
  }


}
