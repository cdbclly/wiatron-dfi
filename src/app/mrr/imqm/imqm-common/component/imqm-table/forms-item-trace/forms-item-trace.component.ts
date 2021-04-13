import { CpkCriteriaService } from './../../../service/cpk-criteria.service';
import { ExceljsService } from './../../../service/exceljs.service';
import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-forms-item-trace',
  templateUrl: './forms-item-trace.component.html',
  styleUrls: ['./forms-item-trace.component.scss']
})
export class FormsItemTraceComponent implements OnInit, OnChanges {

  @Input() rawData;
  @Input() allData;
  @Input() seriesHeadWidth;
  scrollConfig = { x: '0px', y: '700px' };
  curList;
  initLoading = true; // bug
  loadingMore = false;
  rawDataSizeSpec = []; // 显示处理过后的rawData
  rawDataDefSpec = [];
  currentIndex = 1; // table 当前 page index
  insepectResult: string; // 检验结果
  dateString: string; // 日期
  dimension: string; // 尺寸
  deformation: string; // 变形度
  tracking: string; // 追溯
  trans: object = {};
  newRawData = [];
  upperAndLower = [];
  tableContent = [];
  newAllData;

  isVisible = false;
  imgDataArr = [];
  constructor(
    public translate: TranslateService,
    private datePipe: DatePipe,
    public exceljs: ExceljsService,
    public imageUrl:CpkCriteriaService
  ) {
    this.translate.get(['imq-yr-date', 'imq-inspectResult', 'imq-dimension', 'imq-deformation', 'imq-menu-tracking',
      'imq-plant', 'imq-product', 'imq-customer', 'imq-supplier', 'imq-model', 'imq-proName', 'imq-partNumber']).subscribe(res => {
        this.dateString = res['imq-yr-date'];
        this.insepectResult = res['imq-inspectResult'];
        this.dimension = res['imq-dimension'];
        this.deformation = res['imq-deformation'];
        this.tracking = res['imq-menu-tracking'];

        this.trans['plant'] = res['imq-plant'];
        this.trans['product'] = res['imq-product'];
        this.trans['customer'] = res['imq-customer'];
        this.trans['supplier'] = res['imq-supplier'];
        this.trans['model'] = res['imq-model'];
        this.trans['proName'] = res['imq-proName'];
        this.trans['partNumber'] = res['imq-partNumber'];
      });
  }

  async ngOnChanges(changes: SimpleChanges) {
    console.log(changes['rawData']);
    console.log(changes['allData']);

    console.log('这里的rawData就是点击放大镜要下载的数据\n', this.rawData);


    this.imgDataArr = [];
    const imgData = await this.imageUrl.getImage({"plant":this.allData['plant'],"partNumber":this.allData['partNumber']}).toPromise();
    // 获取配置的域名
    const iPData = await this.imageUrl.getIp({type: 'sqmsWeb', plant: this.allData['plant'], product: '*', model: '*', productName: '*', partNumber: '*'}).toPromise();

    if (imgData['length'] > 0 && iPData[0]['sqmsWeb']) {
      for (const item of imgData) {
        const dic = {
          name: 'test',
          url: iPData[0]['sqmsWeb'] + item[2]
        }
        this.imgDataArr.push(dic);
      }
    }


    this.newAllData = [];
    this.newAllData = this.rawData;
    // 新的数据结构对应的解析
    // table的表头测试项数据
    const headerDic = this.newAllData[0]['headerField'];
    // table 内容的数据
    const tablContenteData = this.newAllData;
    this.newRawData = this.exceljs.getUpperLimitData(headerDic, tablContenteData, 2, this.allData);
    // console.log('整理好的数据 \n', this.newRawData)
    // console.log('测试项名称  ---\n', this.newRawData['testItem']);
    const length = (this.newRawData['testItem'].length * 100 + 300) + 'px';
    this.scrollConfig = { x: length, y: '700px' };
    console.log(this.scrollConfig)
    this.upperAndLower = [];
    for (const item of this.newRawData['upperLower']) {
      this.upperAndLower.push.apply(this.upperAndLower, item.split('    |    '));
    }
    this.tableContent = [];
    for (const item of this.newRawData['tableContent']) {
      this.tableContent.push(item.slice(4));
    }
  }

  ngOnInit() {
  }

  downloadTotal(title) {

    // 下载的表头数据
    const headerData = [
      ['', 'SN', this.dateString, this.insepectResult],
      ['', 'SN', this.dateString, this.insepectResult],
      ['', 'SN', this.dateString, this.insepectResult]
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
    // 筛选条件数组
    const seletArr = [
      ['Site', this.allData['site'], this.trans['plant'], this.allData['plant'], this.trans['product'], this.allData['product']],
      [this.trans['customer'], this.allData['customer'], this.trans['supplier'], this.allData['vendor'], this.trans['model'], this.allData['model']],
      [this.trans['proName'], this.allData['productName'], this.trans['partNumber'], this.allData['partNumber'], 'Shift', this.allData['shift'] ? this.allData['shift'] : '']
    ];
    // 头部 指定的不需要合并的单元格
    const constHeaderArray = ['A4:A6', 'B4:B6', 'C4:C6', 'D4:D6'];
    // 内容 指定的不需要合并的单元格
    const constContentArray = ['A7:A7', 'B7:B7', 'C7:C7', 'D7:D7'];
    this.exceljs.export(seletArr, headerData, this.newRawData['tableContent'], constHeaderArray, constContentArray, this.allData['number']);

  }


  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }
}
