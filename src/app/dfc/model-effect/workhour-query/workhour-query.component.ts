import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { DfcWorkhourQueryQuery } from './workhour-query';
import { WorkhourQueryService } from './workhour-query.service';
import { DfcCommonService } from 'app/shared/dfc-common/service/dfc-common.service';
import { DfcSelectNewService } from 'app/dfc/dfc-select-new.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-workhour-query',
  templateUrl: './workhour-query.component.html',
  styleUrls: ['./workhour-query.component.scss']
})
export class WorkhourQueryComponent implements OnInit, OnDestroy {
  option;
  name;
  text;
  process;
  @ViewChild('DFCReportMoh') dfcReportMoh: ElementRef;
  nzScroll: {} = { x: '1380px' };
  PlantMapping = JSON.parse(localStorage.getItem('DFC_PlantMapping'));
  datas;
  timeFlag = 'a';

  // 製程相關
  tempListOfProcessSelectOption = []; // 暫存的下拉內容
  // 全部的projectName
  tempProjectNameList = [];

  objectKeys = Object.keys; // 方便遍歷 對象, 用於顯示
  querySelect = { ...DfcWorkhourQueryQuery };
  querySelectOther = {
    tempListOfProcessSelectOption: [], // 暫存 製程的下拉內容
    tempProCodeData: {} // 暫存 Project Code 內容
  };
  dataSet = []; // 表格数据暂存
  destroy$ = new Subject();
  trans: Object = {};
  constructor(
    private workhourQueryService: WorkhourQueryService,
    private dfcCommonService: DfcCommonService,
    private dfcSelectService: DfcSelectNewService,
    private message: NzMessageService,
    private translate: TranslateService
  ) {
  }

  ngOnInit() {
    // 初始化I18N;
    this.translate.get(['mrr.nudd-process', 'dfq.dfq-plant', 'dfq.dfq-customer', 'dfq.dfq-product', 'dfc.working-hours-trend-chart', 'dfq.dfq-model', 'report.select-all']).subscribe(res => {
      this.querySelect.plant.style.label = res['dfq.dfq-plant'];
      this.querySelect.custom.style.label = res['dfq.dfq-customer'];
      this.querySelect.productType.style.label = res['dfq.dfq-product'];
      this.querySelect.process.style.label = res['mrr.nudd-process'];
      this.trans['workHoursChart'] = res['dfc.working-hours-trend-chart'];
      this.trans['model'] = res['dfq.dfq-model'];
      this.trans['selectAll'] = res['report.select-all'];
    });
    // 當點擊切換語言
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(cur => {
      this.translate.get(['mrr.nudd-process', 'dfq.dfq-plant', 'dfq.dfq-customer', 'dfq.dfq-product', 'dfc.working-hours-trend-chart', 'dfq.dfq-model', 'report.select-all']).subscribe(res => {
        this.querySelect.plant.style.label = res['dfq.dfq-plant'];
        this.querySelect.custom.style.label = res['dfq.dfq-customer'];
        this.querySelect.productType.style.label = res['dfq.dfq-product'];
        this.querySelect.process.style.label = res['mrr.nudd-process'];
        this.trans['workHoursChart'] = res['dfc.working-hours-trend-chart'];
        this.trans['model'] = res['dfq.dfq-model'];
        this.trans['selectAll'] = res['report.select-all'];
      });
    });
    this.initSelect();
  }

  initSelect() {
    // 清空選項值
    this.querySelect.plant.value = '';
    this.querySelect.custom.value = '';
    this.querySelect.productType.value = '';
    this.querySelect.process.value = '';
    this.querySelect.proName.value = '';
    this.querySelect.proCode.value = '';
    this.querySelect.model.value = '';
    // 初始化下拉框
    this.initPlantSelect();
    this.initCustomerSelect();
    this.initProductTypeSelect();
    this.initProcessSelect();
    this.initProNameSelect();
    this.initModelSelect();
    // 獲取產品下拉框中數據
    this.productTypeSelect();
  }

  // 廠別下拉框選擇
  initPlantSelect() {
    this.dfcSelectService.getPlant().subscribe(data => this.querySelect.plant.select.selectList = data);
    // 对厂别自动带入本厂的标签
    this.querySelect.plant.value = localStorage.getItem('DFC_Plant');
    // 監聽下拉框的值改變
    const changePlantList = (plant?) => {
      return of(plant);
    };
    const changePlantList$: Observable<string> = this.querySelect.plant.change$.asObservable().pipe(debounceTime(500)).pipe(switchMap(changePlantList));
    // 下拉框的值改變后，更改下一個下拉框中的值
    changePlantList$.subscribe(datas => {
      // this.buSelect(datas); // 改變 BU 的值
      if (!!datas) {
        this.customerSelect(datas); // 改變客戶
        this.processSelect(datas, this.querySelect.productType.value);
        this.proNameSelect(datas);
      }
      this.querySelect.custom.value = '';
      this.querySelect.proName.value = '';
      this.querySelect.proCode.value = '';
      this.querySelect.model.value = '';
    });
  }

  // 客戶別下拉框
  initCustomerSelect() {
    // 監聽下拉框的值改變
    const changeCustomerList = (custom?) => {
      return of(custom);
    };
    const changeCustomerList$: Observable<string> = this.querySelect.custom.change$.asObservable().pipe(debounceTime(500)).pipe(switchMap(changeCustomerList));
    // 下拉框的值改變后，更改下一個下拉框中的值
    changeCustomerList$.subscribe(datas => {
      if (this.querySelect.plant.value) {
        this.proNameSelect(this.querySelect.plant.value, datas, this.querySelect.productType.value);
      }
      this.querySelect.proName.value = '';
      this.querySelect.proCode.value = '';
      this.querySelect.model.value = '';
    });
    // 搜索相關查詢
    const searchCustomerList = (custom?) => {
      return of(custom);
    };
    const searchCustomerList$: Observable<string[]> = this.querySelect.custom.select.searchChange$.asObservable().pipe(debounceTime(500)).pipe(switchMap(searchCustomerList));
    // 下拉框的值改變后，更改下一個下拉框中的值
    searchCustomerList$.subscribe(datas => {
      if (this.querySelect.plant.value) {
        this.customerSelect(this.querySelect.plant.value, datas); // 改變Plant的值
      }
    });
  }

  customerSelect(plant?, customer?) {
    this.dfcSelectService.getCustom(plant, '', customer).subscribe(data => this.querySelect.custom.select.selectList = data);
  }

  // 產品別下拉框
  initProductTypeSelect() {
    // 監聽下拉框的值改變
    const changeProductTypeList = (productType?) => {
      return of(productType);
    };
    const productTypeList$: Observable<string> = this.querySelect.productType.change$.asObservable().pipe(debounceTime(500)).pipe(switchMap(changeProductTypeList));
    // 下拉框的值改變后，更改下一個下拉框中的值
    productTypeList$.subscribe(datas => {
      if (this.querySelect.plant.value) {
        this.processSelect(this.querySelect.plant.value, datas); // 改變  製程 的值
        this.proNameSelect(this.querySelect.plant.value, this.querySelect.custom.value, datas);
      }
      this.querySelect.proName.value = '';
      this.querySelect.proCode.value = '';
      this.querySelect.model.value = '';
    });
  }

  productTypeSelect() {
    this.dfcSelectService.getProductType().subscribe(data => this.querySelect.productType.select.selectList = data);
  }

  // 製程下拉框
  initProcessSelect() {
    this.dfcSelectService.getProcess().subscribe(datas => this.querySelectOther.tempListOfProcessSelectOption = datas);
  }

  processSelect(plant?, productType?) {
    this.dfcCommonService.getProcess(plant, productType).subscribe(datas => {
      if (datas.length > 0) {
        this.querySelect.process.select.selectList = this.querySelectOther.tempListOfProcessSelectOption.filter(t => datas[0]['processCode'].split(',').includes(t.Value));
      } else {
        this.querySelect.process.select.selectList = [];
      }
    });
  }

  // 機種下拉框
  initProNameSelect() {
    // 監聽下拉框的值改變
    const changeProNameList = (pName?) => {
      return of(pName);
    };
    const changeProNameList$: Observable<string> = this.querySelect.proName.change$.asObservable().pipe(debounceTime(500)).pipe(switchMap(changeProNameList));
    // 下拉框的值改變后，更改下一個下拉框中的值
    changeProNameList$.subscribe(datas => {
      if (!!datas) {
        this.modelSelect(datas);
      }
      this.querySelect.proCode.select.selectList = !!this.querySelectOther.tempProCodeData[datas] ? [this.querySelectOther.tempProCodeData[datas]] : [];
      this.querySelect.proCode.value = !!this.querySelectOther.tempProCodeData[datas] ? this.querySelectOther.tempProCodeData[datas]['Value'] : '';
      this.querySelect.model.value = '';
    });
    // 搜索相關查詢
    const searchProNameList = (pName?) => {
      return of(pName);
    };
    const searchProNameList$: Observable<string[]> = this.querySelect.proName.select.searchChange$.asObservable().pipe(debounceTime(500)).pipe(switchMap(searchProNameList));
    // 下拉框的值改變后，更改下一個下拉框中的值
    searchProNameList$.subscribe(datas => {
      if (this.querySelect.plant.value) {
        this.proNameSelect(
          this.querySelect.plant.value,
          this.querySelect.custom.value,
          this.querySelect.productType.value,
          datas); // 改變Plant的值
      }
    });
  }

  proNameSelect(plant?, custom?, productType?, proName?) {
    this.dfcSelectService.getProName(plant, '', custom, productType, proName, true).subscribe(data => {
      this.querySelect.proName.select.selectList = data['proName'];
      this.querySelectOther.tempProCodeData = data['proCode'];
    });
  }

  // Model下拉框
  initModelSelect() {
    // 搜索相關查詢
    const searchModelList = (model?) => {
      return of(model);
    };
    const searchModelList$: Observable<string[]> = this.querySelect.model.select.searchChange$.asObservable().pipe(debounceTime(500)).pipe(switchMap(searchModelList));
    // 下拉框的值改變后，更改下一個下拉框中的值
    searchModelList$.subscribe(datas => {
      this.modelSelect(this.querySelect.proName.value, datas); // 改變Plant的值
    });
  }

  modelSelect(proName?, model?) {
    if (!!proName || !!model) {
      this.dfcSelectService.getModel(proName, model, true).subscribe(datas => {
        this.querySelect.model.select.selectList = datas['list'];
        if (!!this.querySelect.proName.value) {
          this.querySelect.model.value = datas['def'];
        }
      });
    }
  }

  async query() {
    if (!this.querySelect.plant.value
      || !this.querySelect.custom.value
      || !this.querySelect.productType.value
      || !this.querySelect.proName.value
      || !this.querySelect.proCode.value
      || !this.querySelect.model.value) {
      this.message.create('error', this.trans['selectAll']);
      return;
    }
    if (this.timeFlag === 'b') {
      return;
    }
    this.timeFlag = 'b';
    // 根據config判斷出 某些機種沒有 C0~C1
    const stageShowFlag = false;
    this.datas = await this.workhourQueryService.getWH(this.querySelect.model.value, this.querySelect.process.value, stageShowFlag).toPromise().then(data => data).catch(error => console.log(error));
    const modelName = this.querySelect.model.select.selectList.find(data => data.Value === this.querySelect.model.value);
    this.name = modelName['Label'];
    if (this.querySelect.process.value) {
      const process = this.querySelect.process.select.selectList.find(data => data.Value === this.querySelect.process.value);
      this.process = process['Label'];
      this.text = this.name + this.trans['model'] + this.process + this.trans['workHoursChart'];
    } else {
      this.text = this.name + this.trans['model'] + this.trans['workHoursChart'];
    }
    const totledatas = this.getStage(this.datas, stageShowFlag);
    this.getoption(totledatas);
    this.timeFlag = 'a';
  }

  getStage(data, stageShowFlag) {
    if (!data) {
      return { 'Stage': [], 'time': [], 'target': [] };
    }
    const totledatas = data.reduce((p, t) => {
      if (stageShowFlag || (!stageShowFlag && !['C0', 'C1'].includes(t['Stage']))) {
        p['Stage'].push(t['Stage']);
        p['time'].push(t['time']);
        p['target'].push(t['target']);
      }
      return p;
    }, { 'Stage': [], 'time': [], 'target': [] });
    return totledatas;
  }

  getoption(totledatas) {
    const colors = [];
    for (let index = 0; index < totledatas.target.length; index++) {
      const target = parseFloat(totledatas.target[index]);
      const time = parseFloat(totledatas.time[index]);
      if ((target - time) < 0) {
        colors.push('red');
      } else {
        colors.push('green');
      }
    }
    this.option = {
      title: [
        {
          text: this.text,
          x: '50%',
          // y: '10%',
          textAlign: 'center',
          textStyle: {
            fontSize: 24,
            color: 'black',
          },
        },
      ],
      tooltip: {
        trigger: 'axis'
      },
      toolbox: {
        show: false,
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ['line', 'bar'] },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      calculable: true,
      legend: {
        x: '75%',
        y: '5%',
        show: true,
        data: ['工時', 'Target']
      },
      xAxis: [
        {
          show: true,
          type: 'category',
          data: totledatas.Stage
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: '工時(s)',
          axisLabel: {
            formatter: '{value}'
          }
        },
      ],
      series: [
        {
          name: '工時',
          type: 'bar',
          barWidth: '28px',
          itemStyle: {
            normal: {
              color: function (params) {
                const colorList = colors;
                return colorList[params.dataIndex];
              }
            }
          },
          label: {
            normal: {
              padding: [0, 0, -3, 0],
              show: true,
              position: 'top',
              textStyle: {
                'fontSize': 14,
                color: 'black'
              }
            }
          },
          data: totledatas.time
        },
        {
          name: 'Target',
          type: 'line',
          label: {
            normal: {
              padding: [0, 0, -3, 0],
              show: false,
              position: 'top',
              textStyle: {
                'fontSize': 14,
                color: 'black'
              }
            }
          },
          data: totledatas.target,
          markLine: {
            silent: true,
            data: [{
              name: '平均线',
              // 支持 'average', 'min', 'max'
              type: 'average'
            }]
          }
        }
      ]
    };
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
