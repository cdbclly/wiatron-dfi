import { CpkCriteriaService } from './../../../service/cpk-criteria.service';
import { TranslateService } from '@ngx-translate/core';
import { DownloadRawdataService } from './../../../../pages/download-rawdata/download-rawdata.service';
import { AbnormalBoardService } from './../../../../pages/abnormal-board/abnormal-board.service';
import { ToolkitService } from './../../../../imqm-common/service';
import { DatePipe } from '@angular/common';
import { ExceljsService } from './../../../service/exceljs.service';
import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-material-pie-product',
  templateUrl: './material-pie-product.component.html',
  styleUrls: ['./material-pie-product.component.scss']
})
export class MaterialPieProductComponent implements OnInit, OnChanges {

  pieChart;
  @Input() pieOptions;
  @Input() isYrTrend;
  @Output('subDetail') subDetail = new EventEmitter<any>();
  select;
  dataAlert;
  subFormsList;
  isVisible = false;
  cancelOK = false;
  footer = null;
// 如果是第一层界面的饼图，则去下载的excel掉表头
  isDeleteExcelHeader = false;
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
  rawData;

  // excel导出的筛选条件
  plant: string;
  product: string;
  customer: string;
  supplier:string; // 供应商
  model: string;
  proName: string;
  partNumber: string;

  upperAndLower = []; // 上下限
  newRawData = [];
  tableContent = [];

  imgDataArr = [];
  isVisible1 = false;
  constructor(
    private datePipe: DatePipe,
    public exceljs: ExceljsService,
    private toolKits: ToolkitService,
    private translate: TranslateService,
    private service: DownloadRawdataService,
    private abnormalService: AbnormalBoardService,
    public imageUrl:CpkCriteriaService
  ) { }
  ngOnChanges(changes: SimpleChanges) {
    this.translate.get(['imq-snNumber', 'imq-dimension', 'imq-inspectResult', 'imq-yr-date', 'imq-deformation', 'imq-menu-downloadrawdata',
    'imq-plant', 'imq-product', 'imq-customer', 'imq-supplier', 'imq-model', 'imq-proName', 'imq-partNumber']).subscribe(res => {
      this.dimension = res['imq-dimension'];
      this.snNumber = res['imq-snNumber'];
      this.insepectResult = res['imq-inspectResult'];
      this.dateString = res['imq-yr-date'];
      this.deformation = res['imq-deformation'];

      this.trans['plant'] = res['imq-plant'];
      this.trans['product'] = res['imq-product'];
      this.trans['customer'] = res['imq-customer'];
      this.trans['supplier'] = res['imq-supplier'];
      this.trans['model'] = res['imq-model'];
      this.trans['proName'] = res['imq-proName'];
      this.trans['partNumber'] = res['imq-partNumber'];

    });
    this.pieOptions = changes['pieOptions'].currentValue;
    if (this.pieOptions !== undefined) {
      this.select = this.pieOptions['downloadSelect'];
      this.getPieChart(this.pieOptions);
    }
  }
  ngOnInit() {
  }

  getPieChart(options) {
    if (options !== '') {
      this.pieChart = {
        title: {
          text: options['title'],
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          // formatter: '{a} <br/>{b} : {c} ({d}%)',
          formatter: function (params) {
            return params['seriesName'] + "</br>" + params['name'] + ":" +
              params['value'] + "(" + params['percent'].toFixed(1) + ")%";
          },
          backgroundColor: 'rgba(255,255,255,0.7)',
          textStyle: {
            color: 'black'
          }
        },
        legend: options['legend'],
        backgroundColor: 'rgba(255,255,255,0.7)',
        calculable: true,
        grid: options['grid'],
        series: options['series']
      };
    } else {
      this.pieChart = null;
    }
  }


  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }
  async showSubDetail(event) {
    this.subDetail.emit(event);
    const selectItem = this.pieOptions['downloadSelect'];
    this.isDeleteExcelHeader = this.pieOptions['deleteExcelHeader'] ? this.pieOptions['deleteExcelHeader'] : false;
    if (!selectItem) {
      return;
    }
    const data = {
      site: selectItem.site, plant: selectItem.plant, customer: selectItem.customer, product: selectItem.product,
      model: selectItem.model, vendor: selectItem.vendor, productName: selectItem.productName,
      partNumber: selectItem.partNumber
    };

    if (event['data']['tag'] === 'appearance') {
      data['visualizationResult'] = false;
    }
    if (event['data']['tag'] === 'size') {
      data['sizeResult'] = false;
    }
    if (event['data']['tag'] === 'deformation') {
      data['deformatResult'] = false;
    }
    if (event['data']['tag'] === 'count') {
      data['countResult'] = false;
    }
    if (event['data']['tag'] === 'measurement') {
      data['measurementResult'] = false;
    }
    this.service.getRawdataList(data, selectItem.date_from, selectItem.date_to).subscribe(async res => {
      // console.log('下载数据 == \n', res)
      this.newRawData = [];
      if (!res || res['rawData'].length === 0) {
        return;
      }
      if (!this.isYrTrend) {
        this.rawData = res['rawData'][0]['_source'];

        if (!this.isDeleteExcelHeader) {
          this.imgDataArr = [];
          const imgData = await this.imageUrl.getImage({"plant":this.rawData['plant'],"partNumber":this.rawData['partNumber']}).toPromise();
          // 获取配置的域名
          const iPData = await this.imageUrl.getIp({type: 'sqmsWeb', plant: this.rawData['plant'], product: '*', model: '*', productName: '*', partNumber: '*'}).toPromise();

          if (imgData['length'] > 0 && iPData[0]['sqmsWeb']) {
            for (const item of imgData) {
              const dic = {
                name: 'test',
                url: iPData[0]['sqmsWeb'] + item[2]
              }
              this.imgDataArr.push(dic);
            }
          }
        }


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
        this.isVisible = true;
      } else {
        const abnormals = await this.abnormalService.getAbnormalWhere(this.toolKits.assembleSelectObject(data.site, data.plant,
          data.product, data.customer, data.model, data.vendor, data.productName, data.partNumber),
          Math.ceil(selectItem['selectDate'].date_from / 1000), Math.ceil(selectItem['selectDate'].date_to / 1000));
          const unitSerialNumberArray = res['rawData'].map(item => item['_source']['unitSerialNumber']);
        this.dataAlert = abnormals.filter(item => unitSerialNumberArray.some(number => item['rawData'].indexOf(number) > -1));
        this.dataAlert.forEach(element => {
          element['objName'] = 'abnormal';
          element['expand'] = false;
        });
      }
    });

  }


  downloadTotal(title) {
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
    // 下载的excel是否存在表头
    let isHaveHeader;
    if (this.isDeleteExcelHeader) {
      isHaveHeader = [];
    } else {
      isHaveHeader = headerData;
    }
    this.exceljs.export(seletArr,isHaveHeader, this.newRawData['tableContent'], constHeaderArray, constContentArray, title);
  }

  showFormDetail(form) {
    console.log(form);
    if (form['objName'] === 'abnormal') {
      // 根据 单号获取异常 列表数据
      this.abnormalService.getAbnormalRawDataBySN(form['number']).subscribe(result => {

        const res = result['rawData'];
        const tempData = JSON.parse(res[0]['rawData']);
        tempData['headerField'] = result['headerField'];
        this.subFormsList = {form: form, rawData: JSON.stringify(tempData), date: new Date().getTime()};

        // this.subFormsList = { form: form, rawData: res[0]['rawData'], date: new Date().getTime() };
        console.log('第一层传到第三层的allData数据 \n', this.subFormsList);
      });
    }
  }


  showModal(): void {
    this.isVisible1 = true;
  }

  handleOk1(): void {
    this.isVisible1 = false;
  }

  handleCancel1(): void {
    this.isVisible1 = false;
  }
}
