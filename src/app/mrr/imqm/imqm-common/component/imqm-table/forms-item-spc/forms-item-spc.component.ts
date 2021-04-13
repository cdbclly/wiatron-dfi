import { ExceljsService } from './../../../service/exceljs.service';
import { CpkCriteriaService } from './../../../service/cpk-criteria.service';
import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-forms-item-spc',
  templateUrl: './forms-item-spc.component.html',
  styleUrls: ['./forms-item-spc.component.scss']
})
export class FormsItemSpcComponent implements OnInit, OnChanges, OnDestroy {

  @Input() rawData;
  @Input() allData;
  @Input() seriesHeadWidth: any[];
  curList;
  initLoading = true; // bug
  loadingMore = false;
  isVisible = false;
  footer = null;
  cancelOK = false;
  chartX; // 均值圖(X圖)
  chartR; // 極差圖(R圖)
  currentIndex = 0; // table 当前 page index
  scrollConfig;
  rawDataSizeSpec = []; // 显示处理过后的rawData
  rawDataDefSpec = [];
  destroy$ = new Subject();
  trans: Object = {};
  lang;
  judgeData;
  dimension: string; // 尺寸
  snCount: string; // SN数量
  deformation: string; // 变形度
  spcViolation: string; // SPC违规项
  downLoadTitle: string;
  constructor(
    private translate: TranslateService,
    private service: CpkCriteriaService,
    private exceljs: ExceljsService,
  ) {
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(async lang => {
      this.translate.get(['imq-xAverage', 'imq-rRange', 'imq-count', 'imq-dimension', 'imq-deformation', 'imq-plant', 'imq-product', 'imq-customer',
        'imq-supplier', 'imq-model', 'imq-proName', 'imq-partNumber', 'imq-preW-preWarning', 'imq-snCount', 'imq-spcViolation']).subscribe(res => {
          this.lang = lang.lang;
          this.trans['xAverage'] = res['imq-xAverage'];
          this.trans['rRange'] = res['imq-rRange'];
          this.trans['count'] = res['imq-count'];
          this.trans['dimension'] = res['imq-dimension'];
          this.trans['deformation'] = res['imq-deformation'];

          this.downLoadTitle = res['imq-preW-preWarning'];
          this.dimension = res['imq-dimension'];
          this.snCount = res['imq-snCount'];
          this.spcViolation = res['imq-spcViolation'];

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
    this.translate.get(['imq-xAverage', 'imq-rRange', 'imq-count', 'imq-dimension', 'imq-deformation', 'imq-plant', 'imq-product', 'imq-customer',
      'imq-supplier', 'imq-model', 'imq-proName', 'imq-partNumber', 'imq-preW-preWarning', 'imq-snCount', 'imq-spcViolation']).subscribe(res => {
        this.trans['xAverage'] = res['imq-xAverage'];
        this.trans['rRange'] = res['imq-rRange'];
        this.trans['count'] = res['imq-count'];
        this.trans['dimension'] = res['imq-dimension'];
        this.trans['deformation'] = res['imq-deformation'];

        this.downLoadTitle = res['imq-preW-preWarning'];
        this.dimension = res['imq-dimension'];
        this.snCount = res['imq-snCount'];
        this.spcViolation = res['imq-spcViolation'];

        this.trans['plant'] = res['imq-plant'];
        this.trans['product'] = res['imq-product'];
        this.trans['customer'] = res['imq-customer'];
        this.trans['supplier'] = res['imq-supplier'];
        this.trans['model'] = res['imq-model'];
        this.trans['proName'] = res['imq-proName'];
        this.trans['partNumber'] = res['imq-partNumber'];

        this.loadingMore = false;
        this.initLoading = false;
        this.curList = this.rawData['size'][0]['detail'].slice(0, 1);
        console.log(this.rawData['size'][0]['detail']);
        let sum = 0;
        this.seriesHeadWidth.map(res => {
          sum = sum + parseInt(res.substring(0, res.indexOf('px')), 0);
          const widthSum = sum + 'px';
          this.scrollConfig = { x: widthSum, y: '500px' };
        });
        this.rawDataSizeSpec = [];
        this.rawDataDefSpec = [];
        this.rawData['size'].map(element => {
          this.rawDataSizeSpec.push(element['xLowerSpecLimit']);
          this.rawDataSizeSpec.push(element['xUpperSpecLimit']);
          // 为了帮Ann应付12/9的汇报，此单当特殊处理
          if (this.allData.number !== 'YJWKS-P520191112000006') {
            // element.name = this.trans['dimension'] + element.name;
            element.name =  element['name_new'] ? element['name_new'] : (this.trans['dimension'] + element['name']);
          }
        });
      });

    // 获取cpk变色判定标准
    this.service.getCpkSetting({ type: 'frequencyAndValue', site: this.rawData['site'], plant: this.rawData['plant'], product: this.rawData['productCat'], model: this.rawData['model'] }).subscribe(data => {
      this.judgeData = data;
    });
  }

  ngOnInit() {

    this.lang = this.translate.currentLang ? this.translate.currentLang : this.translate.defaultLang;
  }

  // onLoadMore(): void {
  //   this.curList = this.rawData['size'][0]['detail'];
  //   this.loadingMore = true;
  // }

  showChart(item) {
    // debugger;
    console.log(item);
    const seriesDataX = []; const seriesDataR = [];
    const xAxisX = []; const xAxisR = [];
    item['spcRawdata'].forEach(raw => {
      seriesDataX.push({
        value: raw['xValue'],
        itemStyle: {
          normal: {
            borderColor: raw['xflag'] === 1 ? '#1047A9' : '#db0014',
            borderWidth: 2,
            color: raw['xflag'] === 1 ? '#1047A9' : '#db0014',
            label: {
              show: true,
              position: 'top',
              color: 'black',
              formatter: '{c}'
            }
          }
        }
      });
      seriesDataR.push({
        value: raw['rValue'],
        itemStyle: {
          normal: {
            borderColor: raw['rflag'] === 1 ? '#1047A9' : '#db0014',
            borderWidth: 2,
            color: raw['rflag'] === 1 ? '#1047A9' : '#db0014',
            label: {
              show: true,
              position: 'top',
              color: 'black',
              formatter: '{c}'
            }
          }
        }
      });
      xAxisX.push(raw['uploadId']);
      xAxisR.push(raw['uploadId']);
    });
    // const xAxisX = seriesDataX;
    // const xAxisR = seriesDataR;
    xAxisX.push('');
    xAxisR.push('');
    this.chartX = {
      title: {
        text: (item['name_new'] ? item['name_new'] : item['name']) + ' ' + this.trans['xAverage'],
        x: 'center'
      },
      grid: {
        x: 70,
        x2: 70,
        y2: 30
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      yAxis: {
        type: 'value',
        min: function (value) {
          return item['xLowerLimit'] < value.min ? (item['xLowerLimit'] - 0.1).toFixed(2) : (value.min - 0.1).toFixed(2);
        },
        max: function (value) {
          return item['xUpperLimit'] > value.max ? (item['xUpperLimit'] + 0.1).toFixed(2) : (value.max + 0.1).toFixed(2);
        }
      },
      xAxis: {
        type: 'category',
        data: xAxisX,
        show: true
      },
      backgroundColor: 'rgba(255,255,255,0.7)',
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255,255,255,0.7)',
        axisPointer: {
          type: 'shadow'
        },
        textStyle: {
          color: 'black'
        }
      },
      legend: {
        orient: 'horizontal',
        data: [this.trans['count']],
        x: 'left'
      },
      calculable: true,
      dataZoom: [
        {
          type: 'slider',
          show: true,
          xAxisIndex: [0],
          top: '92%'
        }
      ],
      series: {
        name: this.trans['count'],
        type: 'line',
        data: seriesDataX,
        lineStyle: {
          normal: {
            color: '#1047A9'
          }
        },
        markLine: {
          silent: true,
          label: {
            normal: {
              show: true
            }
          },
          data: [
            [{ name: 'UCL: ' + parseFloat(item['xUpperLimit']).toFixed(2), yAxis: parseFloat(item['xUpperLimit']).toFixed(2), x: 70, label: { show: true }, itemStyle: { normal: { color: '#dc143c' } } },
            { name: 'UCL', yAxis: parseFloat(item['xUpperLimit']).toFixed(2), xAxis: seriesDataX.length, itemStyle: { normal: { color: '#dc143c' } } }],
            [{ name: 'LCL: ' + item['xLowerLimit'].toFixed(2), yAxis: item['xLowerLimit'].toFixed(2), x: 70, label: { show: true }, itemStyle: { normal: { color: '#dc143c' } } },
            { name: 'LCL', yAxis: item['xLowerLimit'].toFixed(2), xAxis: seriesDataX.length, itemStyle: { normal: { color: '#dc143c' } } }],
            [{ name: 'CL: ' + item['xTarget'].toFixed(2), yAxis: item['xTarget'].toFixed(2), x: 70, label: { show: true }, itemStyle: { normal: { color: '#008B45' } } },
            { name: 'CL', yAxis: item['xTarget'].toFixed(2), xAxis: seriesDataX.length, itemStyle: { normal: { color: '#008B45' } } }]
          ]
        }
      }
    };
    this.chartR = {
      title: {
        text: (item['name_new'] ? item['name_new'] : item['name']) + ' ' + this.trans['rRange'],
        x: 'center'
      },
      grid: {
        x: 70,
        x2: 70,
        y2: 30
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      yAxis: {
        type: 'value',
        min: function (value) {
          return item['rLowerLimit'] < value.min ? (item['rLowerLimit'] - 0.1).toFixed(2) : (value.min - 0.1).toFixed(2);
        },
        max: function (value) {
          return item['rUpperLimit'] > value.max ? (item['rUpperLimit'] + 0.1).toFixed(2) : (value.max + 0.1).toFixed(2);
        }
      },
      xAxis: {
        type: 'category',
        data: xAxisR,
        show: true
      },
      backgroundColor: 'rgba(255,255,255,0.7)',
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255,255,255,0.7)',
        axisPointer: {
          type: 'shadow'
        },
        textStyle: {
          color: 'black'
        }
      },
      legend: {
        data: [this.trans['count'], 'UCL.x', 'LCL.x'],
        x: 'left'
      },
      calculable: true,
      dataZoom: [
        {
          type: 'slider',
          show: true,
          xAxisIndex: [0],
          top: '92%'
        }
      ],
      series: [{
        name: this.trans['count'],
        type: 'line',
        data: seriesDataR,
        lineStyle: {
          normal: {
            color: '#1047A9'
          }
        },
        markLine: {
          silent: true,
          data: [
            [{ name: 'UCL: ' + item['rUpperLimit'], yAxis: item['rUpperLimit'], x: 70, label: { show: true }, itemStyle: { normal: { color: '#dc143c' } } },
            { name: 'UCL', yAxis: item['rUpperLimit'], xAxis: seriesDataR.length, itemStyle: { normal: { color: '#dc143c' } } }],
            [{ name: 'LCL: ' + item['rLowerLimit'], yAxis: item['rLowerLimit'], x: 70, label: { show: true }, itemStyle: { normal: { color: '#dc143c' } } },
            { name: 'LCL', yAxis: item['rLowerLimit'], xAxis: seriesDataR.length, itemStyle: { normal: { color: '#dc143c' } } }]
          ]
        }
      }]
    };
    this.isVisible = true;
    console.log(this.chartX, this.chartR);
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
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

      // machineID
      const temp = ['machineID'];
      for (let i = 0; i < content.length; i++) {
        temp.push(content[i]['testMachineId'] ? content[i]['testMachineId'] : '');
      }
      contentData.push(temp);

      const temp2 = [this.spcViolation];
      for (let i = 0; i < content.length; i++) {
        temp2.push(this.transform(content[i]['spcRule'], this.lang));
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
          } else {
            temp.push(data[k]['detail'][j]['testData']);
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


  transform(value: string, lang: any): any {
    const ruleArr = value.split(';');
    const ruleRes = [];
    ruleArr.forEach(rule => {
      if (lang === 'en') {
        if (rule.includes('(a)')) {
          ruleRes.push(rule.replace('(a)', 'Point over the control line or just on the control line'));
        } else if (rule.includes('(b)')) {
          ruleRes.push(rule.replace('(b)', '2 of the 3 points are between 2-3 times the standard deviation'));
        } else if (rule.includes('(c1)')) {
          ruleRes.push(rule.replace('(c1)', '9 continous points over the Centerline'));
        } else if (rule.includes('(c2)')) {
          ruleRes.push(rule.replace('(c2)', '9 continous points below the Centerline'));
        } else if (rule.includes('(d1)')) {
          ruleRes.push(rule.replace('(d1)', '7continous points are upward trend'));
        } else if (rule.includes('(d2)')) {
          ruleRes.push(rule.replace('(d2)', '7continous points are decline trend'));
        }
      }
      if (lang === 'zh') {
        if (rule.includes('(a)')) {
          ruleRes.push(rule.replace('(a)', '點在控制界限外或恰在控制界限上(1點即Fail)'));
        } else if (rule.includes('(b)')) {
          ruleRes.push(rule.replace('(b)', '3點中有 2 點在 2 倍標準差至 3 倍標準差之間'));
        } else if (rule.includes('(c1)')) {
          ruleRes.push(rule.replace('(c1)', '同側鏈：中心線上側出現9長鏈'));
        } else if (rule.includes('(c2)')) {
          ruleRes.push(rule.replace('(c2)', '同側鏈：中心線下側出現9長鏈'));
        } else if (rule.includes('(d1)')) {
          ruleRes.push(rule.replace('(d1)', '單調鏈：連續7點同為上升傾向'));
        } else if (rule.includes('(d2)')) {
          ruleRes.push(rule.replace('(d2)', '單調鏈：連續7點同為下降傾向'));
        }
      }
    });
    return ruleRes.join(';');
  }
}
