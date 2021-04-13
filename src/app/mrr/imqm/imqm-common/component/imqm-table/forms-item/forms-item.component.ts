import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ExceljsService } from '../../../service/exceljs.service';
import { CpkCriteriaService } from '../../../service/cpk-criteria.service';

@Component({
  selector: 'app-forms-item',
  templateUrl: './forms-item.component.html',
  styleUrls: ['./forms-item.component.scss']
})
export class FormsItemComponent implements OnInit, OnChanges {

  @Input() rawData;
  @Input() allData;
  @Input() seriesHeadWidth: any[];
  scrollConfig = { x: '0px', y: '700px' };
  curList;
  initLoading = true; // bug
  loadingMore = false;
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
  imgDataArr = [];
  constructor(
    public translate: TranslateService,
    public exceljs: ExceljsService,
    public imageUrl:CpkCriteriaService
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

  async ngOnChanges(changes: SimpleChanges) {
    console.log(changes['rawData']);
    // console.log('这里的rawData就是点击放大镜要下载的数据\n', this.rawData);
    this.imgDataArr = [];
    const imgData = await this.imageUrl.getImage({"plant":this.rawData['plant'],"partNumber":this.rawData['partNumber']}).toPromise();
    // 获取配置的域名
    const iPData = await this.imageUrl.getIp({type: 'sqmsWeb', plant: this.rawData['plant'], product: '*', model: '*', productName: '*', partNumber: '*'}).toPromise();
    if (imgData['length'] > 0 && iPData[0]['sqmsWeb']) {
      for (const item of imgData) {
        const dic = {
          name: item[3],
          url: iPData[0]['sqmsWeb'] + item[2]
        }
        this.imgDataArr.push(dic)
      }
    }
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

  ngOnInit() {
  }

  // onLoadMore(): void {
  //   this.curList = this.rawData['size'][0]['detail'];
  //   this.loadingMore = true;
  // }

  close() {
  }

  reject() {
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
      ['Site', tempSelect['site'], this.trans['plant'], tempSelect['plant'], this.trans['product'], tempSelect['productCat']],
      [this.trans['customer'], tempSelect['customer'], this.trans['supplier'], tempSelect['vendor'], this.trans['model'], tempSelect['model']],
      [this.trans['proName'], tempSelect['productName'], this.trans['partNumber'], tempSelect['partNumber'], 'Shift', tempSelect['shift']]
    ];
    // 头部 指定的不需要合并的单元格
    const constHeaderArray = ['A4:A6', 'B4:B6', 'C4:C6'];
    // 内容 指定的不需要合并的单元格
    const constContentArray = ['A7:A7', 'B7:B7', 'C7:C7'];
    this.exceljs.export(seletArr, headerData, this.newRawData['tableContent'], constHeaderArray, constContentArray, this.downLoadTitle);
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
