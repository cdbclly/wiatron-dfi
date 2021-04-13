import { NormalDistributionService } from './../../../service/normal-distribution.service';
import { ExceljsService } from './../../../service/exceljs.service';
import { CpkCriteriaService } from './../../../service/cpk-criteria.service';
import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { async } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-forms-item-cpk',
  templateUrl: './forms-item-cpk.component.html',
  styleUrls: ['./forms-item-cpk.component.scss']
})
export class FormsItemCpkComponent implements OnInit, OnChanges, OnDestroy {

  @Input() rawData;
  @Input() allData;
  @Input() seriesHeadWidth: any[];
  judgeData;
  scrollConfig;
  curList;
  initLoading = true; // bug
  loadingMore = false;
  rawDataSizeSpec = []; // 显示处理过后的rawData
  rawDataDefSpec = [];
  currentIndex = 1; // table 当前 page index

  // i18n
  destroy$ = new Subject();
  trans: Object = {};

  dimension: string; // 尺寸
  snCount: string; // SN数量
  downLoadTitle: string;
  isVisible = false;
  cancelOK = false;
  footer = null;
  chart; // 正态分布直方图
  xLowerSpecLimit;
  xUpperSpecLimit;
  mean;
  sigma;
  count;
  cpm;
  cp;
  cpl;
  cpu;
  cpk;

  constructor(
    private translate: TranslateService,
    private service: CpkCriteriaService,
    private exceljs: ExceljsService,
    private distribution: NormalDistributionService
  ) {
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(async lang => {
      this.translate.get(['imq-dimension', 'imq-deformation', 'imq-plant', 'imq-product', 'imq-customer',
        'imq-supplier', 'imq-model', 'imq-proName', 'imq-partNumber']).subscribe(res => {
          this.trans['dimension'] = res['imq-dimension'];
          this.trans['deformation'] = res['imq-deformation'];

          this.trans['plant'] = res['imq-plant'];
          this.trans['product'] = res['imq-product'];
          this.trans['customer'] = res['imq-customer'];
          this.trans['supplier'] = res['imq-supplier'];
          this.trans['model'] = res['imq-model'];
          this.trans['proName'] = res['imq-proName'];
          this.trans['partNumber'] = res['imq-partNumber'];
        });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.translate.get(['imq-dimension', 'imq-deformation', 'imq-snCount', 'imq-preW-preWarning', 'imq-plant', 'imq-product', 'imq-customer',
      'imq-supplier', 'imq-model', 'imq-proName', 'imq-partNumber']).subscribe(item => {
        this.trans['dimension'] = item['imq-dimension'];
        this.trans['deformation'] = item['imq-deformation'];

        this.trans['plant'] = item['imq-plant'];
        this.trans['product'] = item['imq-product'];
        this.trans['customer'] = item['imq-customer'];
        this.trans['supplier'] = item['imq-supplier'];
        this.trans['model'] = item['imq-model'];
        this.trans['proName'] = item['imq-proName'];
        this.trans['partNumber'] = item['imq-partNumber'];

        this.downLoadTitle = item['imq-preW-preWarning'];
        this.dimension = item['imq-dimension'];
        this.snCount = item['imq-snCount'];
        this.loadingMore = false;
        this.initLoading = false;
        this.rawDataSizeSpec = [];
        this.rawDataDefSpec = [];
        this.curList = this.rawData['size'][0]['detail'].slice(0, 1);
        let sum = 0;
        this.seriesHeadWidth.map(res => {
          sum = sum + parseInt(res.substring(0, res.indexOf('px')), 0);
          const widthSum = sum + 'px';
          this.scrollConfig = { x: widthSum, y: '500px' };
        });
        this.rawData['size'].map(element => {
          this.rawDataSizeSpec.push(element['xLowerSpecLimit']);
          this.rawDataSizeSpec.push(element['xUpperSpecLimit']);
          element.name =  element['name_new'] ? element['name_new'] : (this.trans['dimension'] + element['name']);
        });
      });
    // 获取cpk变色判定标准
    this.service.getCpkSetting({ type: 'frequencyAndValue', site: this.rawData['site'], plant: this.rawData['plant'], product: this.rawData['productCat'], model: this.rawData['model'] }).subscribe(data => {
      this.judgeData = data;
    });
  }

  ngOnInit() {
  }

  onLoadMore(): void {
    this.curList = this.rawData['size'][0]['detail'];
    this.loadingMore = true;
  }

  close() {
  }

  reject() {
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  downloadTotal(title) {
    // 下载的表头数据
    if (this.rawData['size'].length > 0) {
      const sn = this.snCount + ':' + this.rawData['size'][0]['detail'].length;
      const headerData = [
        [sn],
        [sn]
      ];
      const sizeData = this.rawData['size'];
      for (let i = 0; i < headerData.length; i++) {
        if (i === 0) {
          for (let k = 0; k < sizeData.length; k++) {
            headerData[i].push((sizeData[k]['name_new'] ? sizeData[k]['name_new'] : sizeData[k]['name']));
          }
        } else {
          for (let k = 0; k < sizeData.length; k++) {
            headerData[i].push(sizeData[k]['xLowerSpecLimit'] + '    |    ' + sizeData[k]['xUpperSpecLimit']);
          }
        }
      }

      const contentData = [];
      const content = this.rawData['size'];
      const temp1 = ['CPK'];
      for (let i = 0; i < content.length; i++) {
        temp1.push(content[i]['cpk']);
      }
      contentData.push(temp1);
      const temp2 = ['machineID'];
      for (let i = 0; i < content.length; i++) {
        temp2.push(content[i]['testMachineId'] ? content[i]['testMachineId'] : '');
      }
      contentData.push(temp2);
      const data = this.rawData['size'];
      const recycleCount = this.rawData['size'][0]['detail'].length;
      for (let j = 0; j < recycleCount; j++) {
        const temp = [];
        for (let k = 0; k < data.length; k++) {
          if (k === 0) {
            temp.push(data[k]['detail'][j]['unitSerialNumber']);
            temp.push(data[k]['detail'][j]['testData']);
            // temp.push('');
          } else {
            temp.push(data[k]['detail'][j]['testData']);
            // temp.push('');
          }
        }
        contentData.push(temp);
      }

      // 筛选条件数组
      const seletArr = [
        ['Site', this.rawData['site'], this.trans['plant'], this.rawData['plant'], this.trans['product'], this.rawData['productCat']],
        [this.trans['customer'], this.rawData['customer'], this.trans['supplier'], this.rawData['vendor'], this.trans['model'], this.rawData['model']],
        [this.trans['proName'], this.rawData['productName'], this.trans['partNumber'], this.rawData['partNumber'], 'Shift', this.rawData['shift']]
      ];

      // 头部 指定的不需要合并的单元格
      const constHeaderArray = ['A4:A5'];
      // 内容 指定的不需要合并的单元格
      const constContentArray = ['A6:A6'];
      this.exceljs.export(seletArr, headerData, contentData, constHeaderArray, constContentArray, this.downLoadTitle, 2);
    }
  }


  handleCancel(): void {
    this.isVisible = false;
  }

  handleOk(): void {
    this.isVisible = false;
  }

  showChart(ele) {
    this.xLowerSpecLimit = ele['xLowerSpecLimit'];
    this.xUpperSpecLimit = ele['xUpperSpecLimit'];
    this.mean = ele['mean'];
    this.sigma = ele['sigma'];
    if (this.sigma === undefined) {
      return;
    }
    this.count = ele['count'];
    this.cpm = ele['cpm'];
    this.cp = ele['cp'];
    this.cpl = ele['cpl'];
    this.cpu = ele['cpu'];
    this.cpk = ele['cpk'];
    this.sigma = ele['sigma'];
    const title = 'Procee capability of ' + (ele['name_new'] ? ele['name_new'] : ele['name']);
    const lowerlimit = ele['xLowerSpecLimit'].toFixed(2);
    const upperlimit = ele['xUpperSpecLimit'].toFixed(2);
    const arr = [];
    for (const iterator of ele['detail']) {
      arr.push(iterator['testData'].toFixed(2));
    }
    const aim = [];
    for (let i = 0; i < arr.length; i++) {
      const temp = {};
      temp['value'] = arr[i];
      temp['count'] = this.distribution.getSameValueCount(arr, arr[i]);
      aim.push(temp);
    }
    // 将上下限放入aim
    aim.push({ value: lowerlimit, count: 0 });
    aim.push({ value: upperlimit, count: 0 });
    // 去除重复数据
    const normalDisData = this.distribution.deleteDuplicatesElement(aim, ['value']);
    // 将数据按照cpk的数值从小到大排列
    normalDisData.sort((a, b) => {
      return a.value - b.value;
    });
    // 需要的数据
    let normalDisData1 = [];
    let xData = [];
    const yData = [];
    for (let i = 0; i < normalDisData.length; i++) {
      xData.push(normalDisData[i].value);
      yData.push(normalDisData[i].count);
    }
    // 获取count最大值
    const lineTop = Math.max(...yData);
    // 计算平均数
    // const averageDis = this.distribution.average(normalDisData, 'value', 'count');
    const averageDis = ele['mean'];
    // console.log('平均数 = \n', averageDis);
    // 计算标准差
    // const standardDev = this.distribution.standardDeviation(normalDisData, averageDis, 'value', 'count');
    const standardDev = ele['sigma'];
    // console.log('计算标准差 = \n', standardDev);

    // const mean = averageDis;
    // const low = averageDis - standardDev * 3;
    // const up = averageDis + standardDev * 3;
    // xData = this.distribution.addParam(xData, low.toFixed(2));
    // xData = this.distribution.addParam(xData, mean.toFixed(2));
    // xData = this.distribution.addParam(xData, up.toFixed(2));

    normalDisData1 = this.distribution.returnNormalDistributionArray(xData, averageDis, standardDev);
    const markLineY = [];
    markLineY.push([{ name: 'LSL:' + lowerlimit, yAxis: 0, xAxis: xData.indexOf(lowerlimit), itemStyle: { normal: { color: '#abc327' } } },
    { name: 'LSL:', xAxis: xData.indexOf(lowerlimit), yAxis: lineTop, label: { show: true }, itemStyle: { normal: { color: '#abc327' } } }]);

    markLineY.push([{ name: 'USL:' + upperlimit, yAxis: 0, xAxis: xData.indexOf(upperlimit), itemStyle: { normal: { color: '#dc143c' } } },
    { name: 'USL:', xAxis: xData.indexOf(upperlimit), yAxis: lineTop, label: { show: true }, itemStyle: { normal: { color: '#dc143c' } } }]);
    // 绘制正态分布图
    this.chart = {
      title: {
        text: title,
        left: 'center',
        textStyle: {
          fontSize: 18
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        }
      },
      grid: {
        y: 70,
        y2: 40,
        x: 70
      },
      xAxis: [
        {
          type: 'category',
          data: xData,
          axisPointer: {
            type: 'shadow'
          }
        }
      ],
      yAxis: [
        {
          name: 'Count',
        },
        {
          name: 'Capability',
        }
      ],
      series: [
        {
          barCategoryGap: '0%',
          name: 'Count',
          type: 'bar',
          data: yData,
          markLine: {
            silent: true,
            data: markLineY
          },
          itemStyle: {
            borderColor: 'rgba(241, 242, 249, 1)',
            borderWidth: 2
          }
        },
        {
          smooth: true,
          name: 'Capacity',
          type: 'line',
          yAxisIndex: 1,
          data: normalDisData1
        }
      ]
    };
    this.isVisible = true;
  }
}
