import { Component, OnInit } from '@angular/core';
import { MrrDocReportQuery } from './mrr-doc-report';
import { MrrDocSelectService } from '../mrr-doc-select.service';
import { of, Observable, Subject } from 'rxjs';
import { switchMap, debounceTime, takeUntil } from 'rxjs/operators';
import { MrrDocReportService } from './mrr-doc-report.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DownexcelService } from '@service/downexcel.service';
@Component({
  selector: 'app-mrr-doc-report',
  templateUrl: './mrr-doc-report.component.html',
  styleUrls: ['./mrr-doc-report.component.scss']
})
export class MrrDocReportComponent implements OnInit {
  objectKeys = Object.keys; // 方便遍歷 對象, 用於顯示
  querySelect = { ...MrrDocReportQuery }; // 下拉框選項
  rangePickerFormat = 'yyyy/MM/dd'; // 日期格式
  queryOther = {
    dateRange: [],
    stageList: [
      { Value: 'C3', Checked: false },
      { Value: 'C4', Checked: false },
      { Value: 'C5', Checked: false },
      { Value: 'C6', Checked: false }
    ],
    stageValue: [],
    plant: []
  };
  bg;
  echartFlag = false; // echart顯示標誌
  options = []; // echart Option
  dataSet = []; // 下方表格順序
  querySelectBu = [];  // 點擊上一層餅圖BU傳值

  // 彈出框設定
  popParam = {
    isVisible: false,
    width: '60vw',
    title: '',
    dataSet: [],
    stage: ''
  };
  // 路由传的plant
  routPlant;
  transNotice = {};
  constructor(
    private mrrDocSelectService: MrrDocSelectService,
    private mrrDocReportService: MrrDocReportService,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private downExcelService: DownexcelService
  ) { }

  ngOnInit() {
    // 初始化i18n;
    this.translate.get(['mrr.mrr-site', 'mrr.mrr-plant', 'mrr.mrr-product', 'mrr.mrr-customer', 'mrr.mrr-noData', 'dashboard.reachRatio', 'dashboard.mrrDoc-not-set', 'mrr.document-reach', 'mrr.document-notReach', 'dashboard.mrrDoc-upload-file']).subscribe(res => {
      this.querySelect.site.style.label = res['mrr.mrr-site'];
      this.querySelect.plant.style.label = res['mrr.mrr-plant'];
      this.querySelect.productType.style.label = res['mrr.mrr-product'];
      this.querySelect.custom.style.label = res['mrr.mrr-customer'];
      this.transNotice['noData'] = res['mrr.mrr-noData'];
      this.transNotice['reachRate'] = res['dashboard.reachRatio'];
      this.transNotice['noSet'] = res['dashboard.mrrDoc-not-set'];
      this.transNotice['reach'] = res['mrr.document-reach'];
      this.transNotice['notReach'] = res['mrr.document-notReach'];
      this.transNotice['plant'] = res['mrr.mrr-plant'];
      this.transNotice['product'] = res['mrr.mrr-product'];
      this.transNotice['uploadFile'] = res['dashboard.mrrDoc-upload-file'];
    });
    // 當點擊切換語言
    this.translate.onLangChange.pipe(takeUntil(new Subject())).subscribe(cur => {
      this.translate.get(['mrr.mrr-site', 'mrr.mrr-plant', 'mrr.mrr-product', 'mrr.mrr-customer', 'mrr.mrr-noData', 'dashboard.reachRatio', 'dashboard.mrrDoc-not-set', 'mrr.document-reach', 'mrr.document-notReach', 'dashboard.mrrDoc-upload-file']).subscribe(res => {
        this.querySelect.site.style.label = res['mrr.mrr-site'];
        this.querySelect.plant.style.label = res['mrr.mrr-plant'];
        this.querySelect.productType.style.label = res['mrr.mrr-product'];
        this.querySelect.custom.style.label = res['mrr.mrr-customer'];
        this.transNotice['noData'] = res['mrr.mrr-noData'];
        this.transNotice['reachRate'] = res['dashboard.reachRatio'];
        this.transNotice['noSet'] = res['dashboard.mrrDoc-not-set'];
        this.transNotice['reach'] = res['mrr.document-reach'];
        this.transNotice['notReach'] = res['mrr.document-notReach'];
        this.transNotice['plant'] = res['mrr.mrr-plant'];
        this.transNotice['product'] = res['mrr.mrr-product'];
        this.transNotice['uploadFile'] = res['dashboard.mrrDoc-upload-file'];
      });
    });
    this.route.queryParamMap.subscribe(async params => {
      if (!(JSON.stringify(params['params']) === '{}' || !params['params'])) {
        this.querySelect.site.value = params['params']['site'];
        this.querySelect.plant.value = params['params']['plant'];
        this.routPlant = params['params']['plant'];
        this.queryOther.plant = params['params']['plant'].split(',');
        this.bg = params['params']['bu'];
        this.querySelect.productType.value = '';
        this.querySelect.custom.value = '';
        this.querySelect.bu.value = '';
        let businessGroupId = [];
        businessGroupId = await this.mrrDocReportService.getBU(params['params']['bu']).toPromise();
        businessGroupId.forEach(item => { this.querySelectBu.push(item.id); });
        this.queryOther.dateRange[0] = new Date(params['params']['startTime']);
        this.queryOther.dateRange[1] = new Date(params['params']['endTime']);
        this.queryOther.stageValue = params['params']['stage'].split(',');
        this.queryOther.stageList = this.queryOther.stageList.map(data => {
          if (this.queryOther.stageValue.includes(data.Value)) {
            data.Checked = true;
          }
          return data;
        });
        await this.mrrDocSelectService
          .getBu('productDocument', this.queryOther.plant, this.querySelect.productType.value)
          .toPromise().then(async data => {
            this.querySelect.bu.select.selectList = data;
          });
        this.query();
      }
      this.initSelect();
    });
  }

  initSelect() {
    this.initSiteSelect();
    this.initPlantSelect();
    this.initCustomerSelect();
    this.initProductTypeSelect();
    this.productTypeSelect();
  }

  // site下拉框選擇
  initSiteSelect() {
    this.mrrDocSelectService
      .getSite()
      .subscribe(data => (this.querySelect.site.select.selectList = data));
    // 監聽下拉框的值改變
    const changeSiteList = (site?) => {
      return of(site);
    };
    const siteList$: Observable<string[]> = this.querySelect.site.change$
      .asObservable()
      .pipe(debounceTime(500))
      .pipe(switchMap(changeSiteList));
    // 下拉框的值改變后，更改下一個下拉框中的值
    siteList$.subscribe(datas => {
      if (!this.routPlant) {
        this.querySelect.plant.value = '';
      }
      this.plantSelect(datas); // 改變Plant的值
      this.querySelect.productType.value = '';
      this.querySelect.custom.value = '';
      this.querySelect.bu.value = '';
    });
  }

  // plant下拉框
  initPlantSelect() {
    this.mrrDocSelectService.getPlant().subscribe(data => (this.querySelect.plant.select.selectList = data));
    // 監聽下拉框的值改變
    const changePlantList = (plant?) => {
      return of(plant);
    };
    const plantList$: Observable<string[]> = this.querySelect.plant.change$
      .asObservable()
      .pipe(debounceTime(500))
      .pipe(switchMap(changePlantList));
    // 下拉框的值改變后，更改下一個下拉框中的值
    plantList$.subscribe(datas => {
      this.plantSelect(this.querySelect.site.value);
      this.productTypeSelect(datas); // 改變Plant的值
      this.querySelect.custom.value = '';
      this.querySelect.bu.value = '';
    });
  }

  plantSelect(site?) {
    this.mrrDocSelectService.getPlant(site).subscribe(data => (this.querySelect.plant.select.selectList = data));
    if (this.querySelect.plant.value) {
      this.queryOther.plant = this.querySelect.plant.value.split(',');
    } else {
      this.queryOther.plant = this.querySelect.plant.select.selectList.map(data => data.Value);
    }
    this.querySelect.custom.value = '';
    this.querySelect.bu.value = '';
    this.productTypeSelect(this.queryOther.plant);
    this.customerSelect(
      this.queryOther.plant,
      this.querySelect.productType.value
    );
    this.buSelect(this.queryOther.plant, this.querySelect.productType.value);
  }

  // 產品別下拉框
  initProductTypeSelect() {
    // 監聽下拉框的值改變
    const changeProductTypeList = (productType?) => {
      return of(productType);
    };
    const productTypeList$: Observable<
      string[]
    > = this.querySelect.productType.change$
      .asObservable()
      .pipe(debounceTime(500))
      .pipe(switchMap(changeProductTypeList));
    // 下拉框的值改變后，更改下一個下拉框中的值
    productTypeList$.subscribe(datas => {
      this.querySelect.custom.value = '';
      this.querySelect.bu.value = '';
      this.customerSelect(this.queryOther.plant, datas); // 改變  客戶別 的值
      this.buSelect(this.queryOther.plant, datas);
    });
  }

  productTypeSelect(plant?) {
    this.mrrDocSelectService
      .getProductType('productDocument', plant)
      .subscribe(
        data => (this.querySelect.productType.select.selectList = data)
      );
  }

  // 客戶別下拉框
  initCustomerSelect(plant?, productType?, customer?) {
    // 監聽下拉框的值改變
    const changeCustomerList = (custom?) => {
      return of(custom);
    };
    const changeCustomerList$: Observable<
      string[]
    > = this.querySelect.custom.change$
      .asObservable()
      .pipe(debounceTime(500))
      .pipe(switchMap(changeCustomerList));
    // 下拉框的值改變后，更改下一個下拉框中的值
    changeCustomerList$.subscribe(datas => {
      this.querySelect.bu.value = '';
      this.buSelect(
        this.queryOther.plant,
        this.querySelect.productType.value,
        datas
      ); // 改變 幾種下拉框 的值
    });
    // 搜索相關查詢
    const searchCustomerList = (custom?) => {
      return of(custom);
    };
    const searchCustomerList$: Observable<
      string[]
    > = this.querySelect.custom.select.searchChange$
      .asObservable()
      .pipe(debounceTime(500))
      .pipe(switchMap(searchCustomerList));
    // 下拉框的值改變后，更改下一個下拉框中的值
    searchCustomerList$.subscribe(datas => {
      this.customerSelect(
        this.queryOther.plant,
        this.querySelect.productType.value,
        datas
      ); // 改變Plant的值
    });
  }

  customerSelect(plant?, productType?, customer?) {
    this.mrrDocSelectService
      .getCustomer('productDocument', plant, productType, customer)
      .subscribe(data => (this.querySelect.custom.select.selectList = data));
  }

  // 機種下拉框
  initBuSelect(plant?, productType?, customer?, bu?) {
    // 搜索相關查詢
    const searchBuList = (pName?) => {
      return of(pName);
    };
    const searchBuList$: Observable<
      string[]
    > = this.querySelect.bu.select.searchChange$
      .asObservable()
      .pipe(debounceTime(500))
      .pipe(switchMap(searchBuList));
    // 下拉框的值改變后，更改下一個下拉框中的值
    searchBuList$.subscribe(datas => {
      this.buSelect(
        this.queryOther.plant,
        this.querySelect.productType.value,
        this.querySelect.custom.value,
        datas
      ); // 改變Plant的值
    });
  }

  buSelect(plant?, productType?, customer?, bu?) {
    this.mrrDocSelectService
      .getBu('productDocument', plant, productType, customer, bu)
      .subscribe(async data => {
        this.querySelect.bu.select.selectList = data;
      });
  }

  checkStageBox(check) {
    this.queryOther.stageValue = check;
  }

  async query() {
    // 餅圖路由自動查詢按BU分類
    if (this.bg) {
      this.mrrDocReportService.querySummaryData(
        this.queryOther.plant.join(),
        this.querySelect.productType.value,
        this.querySelect.custom.value,
        '',
        this.queryOther.dateRange.length > 0
          ? this.getDateFormat(this.queryOther.dateRange[0])
          : '',
        this.queryOther.dateRange.length > 0
          ? this.getDateFormat(this.queryOther.dateRange[1])
          : '',
        this.queryOther.stageValue
      )
        .then(
          data => {
            this.echartFlag = true;
            this.querySelectBu = [];
            this.options = this.mrrDocReportService.createPie(data, this.queryOther.stageValue, this.transNotice['reachRate'], this.transNotice['noData'], this.transNotice['reach'], this.transNotice['notReach']);  // reachRate, noData, reach, notReach參數
            this.mrrDocReportService.createList(data, this.queryOther.stageValue, this.transNotice['noSet'], this.transNotice['plant'], this.transNotice['product'], this.transNotice['uploadFile']).then(result => { this.dataSet = result; });  //noSet, plant, product, uploadFile參數
            this.routPlant = null;
          }
        );
    } else {
      // 不按BU分類
      this.mrrDocSelectService
        .getPlant(this.querySelect.site.value).pipe(
          switchMap(datas => {
            this.queryOther.plant = datas.map(data => data.Value);
            return this.mrrDocReportService
              .querySummaryData(
                this.queryOther.plant.join(),
                this.querySelect.productType.value,
                this.querySelect.custom.value,
                this.querySelect.bu.value,
                this.queryOther.dateRange.length > 0
                  ? this.getDateFormat(this.queryOther.dateRange[0])
                  : '',
                this.queryOther.dateRange.length > 0
                  ? this.getDateFormat(this.queryOther.dateRange[1])
                  : '',
                this.queryOther.stageValue
              );
          })
        ).subscribe(
          data => {
            this.echartFlag = true;
            this.options = this.mrrDocReportService.createPie(data, this.queryOther.stageValue, this.transNotice['reachRate'], this.transNotice['noData'], this.transNotice['reach'], this.transNotice['notReach']);  // reachRate, noData, reach, notReach參數
            this.mrrDocReportService.createList(data, this.queryOther.stageValue, this.transNotice['noSet'], this.transNotice['plant'], this.transNotice['product'], this.transNotice['uploadFile']).then(result => { this.dataSet = result; });  //noSet, plant, product, uploadFile參數
            this.routPlant = null;
          });
    }
  }

  // 時間格式
  private getDateFormat(date): string {
    const changeDate = new Date(date);
    return (
      changeDate.getFullYear() +
      '/' +
      this.changeTime(changeDate.getMonth() + 1) +
      '/' +
      this.changeTime(changeDate.getDate())
    );
  }

  // 時間格式改變
  private changeTime(data: number): string {
    let d: string;
    if (data < 10) {
      d = '0' + data;
    } else {
      d = data + '';
    }
    return d;
  }

  // echart點擊事件
  clickEchart(event, item) {
    if (!['────', this.transNotice['noData']].includes(event['name'])) {
      this.popParam.dataSet = [];
      this.popParam.isVisible = true;
      this.popParam.title = event['data']['popTitle'];
      this.popParam.stage = event['data']['stageID'];
      for (const plant in event['data']['proNames']) {
        if (event['data']['proNames'].hasOwnProperty(plant)) {
          const plantDatas = event['data']['proNames'][plant];
          plantDatas.forEach(proName => {
            this.popParam.dataSet = [
              ...this.popParam.dataSet,
              {
                plant: plant,
                proName: proName
              }
            ];
          });
        }

      }
    }
  }

  // 彈框消失
  cancelPop() {
    this.popParam.isVisible = false;
    this.popParam.dataSet = [];
    this.popParam.title = '';
    this.popParam.stage = '';
  }

  // 增加Link
  clickLink(proName, plant) {
    this.router.navigate(['/dashboard/mrrDoc/view'], {
      queryParams: {
        plant: plant,
        proName: proName
      }
    });
  }

  download() {
    const table = document.getElementById('downdata');
    this.downExcelService.exportTableAsExcelFile(table, '產品標準文件 Report');
  }
}
