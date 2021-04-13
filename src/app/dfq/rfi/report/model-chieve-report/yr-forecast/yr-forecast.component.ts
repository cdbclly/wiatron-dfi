import { BusinessGroupApi, BusinessGroup, PlantApi, Plant } from '@service/dfi-sdk';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { View_RfiDashboard, View_RfiDashboardApi } from '@service/dfq_sdk/sdk';
import { NzMessageService } from 'ng-zorro-antd';
import { ActivatedRoute, Router } from '@angular/router';
import { DownexcelService } from '@service/downexcel.service';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';
@Component({
  selector: 'app-yr-forecast',
  templateUrl: './yr-forecast.component.html',
  styleUrls: ['./yr-forecast.component.scss']
})
export class YrForecastComponent implements OnInit, OnDestroy {

  // 提示字樣
  // 良率預測工作進程提示字樣
  tipTxt = [
    {
      class: 'square-green',
      text: '目標良率生成已簽核完畢',
      color: 'Green'
    },
    {
      class: 'square-red',
      text: 'RFQ D.D ≤ 系統日期，且未完成目標良率生成簽核',
      color: 'Red'
    },
    {
      class: 'square-yellow',
      text: 'RFQ D.D 前一个月 ≤ 系統日期 ＜ RFQ D.D，且未完成目標良率生成簽核',
      color: 'Yellow'
    },
    {
      class: 'square-grey',
      text: '系統日期 ＜ RFQ D.D 前一个月,且未完成目標良率生成簽核',
      color: 'Gray'
    },
  ];
  rfiWorkProgressRgb = {              // 工作進程rgb參數
    title: '',
    Red: 0,
    Yellow: 0,
    Green: 0,
    Gray: 0,
    Purple: 0,
    totalColor: 0,
    data: []
  };
  statusValue = [];
  selectedValue;
  rfiTableList;
  bgs = [];
  selectedbg;
  colorList = [
    { value: 'Green', label: 'Green', class: 'square-green' },
    { value: 'Red', label: 'Red', class: 'square-red' },
    { value: 'Yellow', label: 'Yellow', class: 'square-yellow' },
    { value: 'Gray', label: 'Gray', class: 'square-grey' },
  ];
  rfiDashboard;
  sitePlantNames = [];
  tableFlag = false;
  innerData = [];
  loadModel = false;
  showColorNumber = false;
  rfiWorkProgressRgbs = [];
  projectNames = [];
  destroy$ = new Subject();

  constructor(
    private View_RfiDashboardService: View_RfiDashboardApi,
    private message: NzMessageService,
    private route: ActivatedRoute,
    private router: Router,
    private businessGroupService: BusinessGroupApi,
    private downexcelService: DownexcelService,
    private plantService: PlantApi,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.rfiTableList = [];
    this.businessGroupService.find<BusinessGroup>({ fields: ['id'] }).subscribe(businessGroups => {
      businessGroups.forEach(item => {
        this.bgs.push(item.id);
      });
    });
    this.plantService.find<Plant>().subscribe(plants => {
      plants.forEach(re => this.sitePlantNames.push(re.siteId + '-' + re.id));
    });
    this.rfiWorkProgressRgb = JSON.parse(localStorage.getItem('rfiPieParam'))['data'];
    // 路由點進來獲取參數或者目錄點進來初始化
    this.route.params.subscribe(param => {
      // 數據路由和localStorage帶過來
      if (param['plantName']) {
        this.selectedValue = param['plantName'].split(':')[0];
        this.statusValue = [param['plantName'].split(':')[1]];
        this.selectedbg = param['plantName'].split(':')[2];
      } else {
        this.selectedbg = undefined;
      }
      this.query();
    });
  }

  // 路由帶了數據但想重新查詢等待加載
  async query() {
    if (!this.selectedValue) {
      this.message.create('error', 'Please select a site!');
      return;
    }
    this.loadModel = true;
    this.innerData = [];
    this.rfiTableList = [];
    this.rfiWorkProgressRgbs = [];
    // 查詢filter
    if (this.statusValue.length === 0) {
      this.statusValue = ['Green', 'Red', 'Yellow', 'Gray'];
    }
    this.rfiDashboard = [];
    if (!this.selectedbg) {
      this.selectedbg = undefined;
    }
    await this.View_RfiDashboardService.find().toPromise().then(async (res: View_RfiDashboard[]) => {
      const plantByBg = await this.plantService.find({ where: { businessGroupId: this.selectedbg }, fields: 'id' }).toPromise();
      let rfiDashbordData = [];
      const plantList = [];
      plantByBg.map(item => plantList.push(item['id']));
      rfiDashbordData = res.filter(itea => itea['color'] && plantList.includes(itea['plant']));
      for (let index = 0; index < rfiDashbordData.length; index++) {
        rfiDashbordData[index]['sitePlant'] = rfiDashbordData[index]['site'] + '-' + rfiDashbordData[index]['plant'];
        // 增加幾種狀態描述欄位describe
        rfiDashbordData[index]['describe'] = '';
        if (rfiDashbordData[index].status === '1') {
          rfiDashbordData[index]['describe'] = '簽核完成';
        } else if (rfiDashbordData[index].status === '0') {
          rfiDashbordData[index]['describe'] = '簽核未完成';
        } else {
          if (!rfiDashbordData[index].useRfiModel) {
            rfiDashbordData[index]['describe'] = '物料良率信息未上傳';
          }
          if (!rfiDashbordData[index].product) {
            rfiDashbordData[index]['describe'] = '機種產品別未維護';
          }
          if (rfiDashbordData[index].product && rfiDashbordData[index].useRfiModel) {
            rfiDashbordData[index]['describe'] = '未送簽';
          }
        }
        // 第二層table資料
        rfiDashbordData[index]['innerData'] = [{
          model: rfiDashbordData[index]['model'],
          status: rfiDashbordData[index]['status'],
          sitePlantName: rfiDashbordData[index]['site'] + '-' + rfiDashbordData[index]['plantName'].slice(1),
          bu: rfiDashbordData[index]['businessUnit'],
          product: rfiDashbordData[index]['product'],
          sitePlant: rfiDashbordData[index]['site'] + '-' + rfiDashbordData[index]['plant'],
        }];
        if (!this.sitePlantNames.includes(rfiDashbordData[index]['sitePlant'])) {
          this.sitePlantNames.push(rfiDashbordData[index]['sitePlant']);
        }
      }
      this.rfiDashboard = rfiDashbordData.filter(item => item['color'] !== null);
    });
    this.rfiTableList = this.rfiDashboard.filter(item => item.sitePlant === this.selectedValue)
      .filter(item => this.statusValue.find(color => item.color === color));
    // 處理所選廠別的rgb總數參數
    this.classify();
    this.rfiWorkProgressRgb = {
      title: '',
      Red: 0,
      Yellow: 0,
      Green: 0,
      Gray: 0,
      Purple: 0,
      totalColor: 0,
      data: []
    };
    for (let i = 0; i < this.rfiWorkProgressRgbs.length; i++) {
      if (this.rfiWorkProgressRgbs[i]['title'] === this.selectedValue) {
        this.rfiWorkProgressRgb = this.rfiWorkProgressRgbs[i];
      }
    }
    this.translateLanguage();
    this.showColorNumber = true;
    this.loadModel = false;
    this.tableFlag = true;
  }

  translateLanguage() {
    // I18N
    this.translate.get(['dfq.rfi-sign-off-completed', 'dfq.sign-off-is-not-completed', 'dfq.material-yield-information-is-not-uploaded', 'dfq.model-product-not-maintained', 'dfq.dfq-sign-not-send']).subscribe(res => {
      this.rfiDashboard.forEach((item) => {
        if (item.describe === '簽核完成') {
          item.describe = res['dfq.rfi-sign-off-completed'];
        } else if (item.describe === '簽核未完成') {
          item.describe = res['dfq.sign-off-is-not-completed'];
        } else if (item.describe === '物料良率信息未上傳') {
          item.describe = res['dfq.material-yield-information-is-not-uploaded'];
        } else if (item.describe === '機種產品別未維護') {
          item.describe = res['dfq.model-product-not-maintained'];
        } else if (item.describe === '未送簽') {
          item.describe = res['dfq.dfq-sign-not-send'];
        }
      });
    });
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(cur => {
      this.translate.get(['dfq.rfi-sign-off-completed', 'dfq.sign-off-is-not-completed', 'dfq.material-yield-information-is-not-uploaded', 'dfq.model-product-not-maintained', 'dfq.dfq-sign-not-send']).subscribe(res => {
        this.rfiDashboard.forEach((item) => {
          if (item.describe === '簽核完成') {
            item.describe = res['dfq.rfi-sign-off-completed'];
          } else if (item.describe === '簽核未完成') {
            item.describe = res['dfq.sign-off-is-not-completed'];
          } else if (item.describe === '物料良率信息未上傳') {
            item.describe = res['dfq.material-yield-information-is-not-uploaded'];
          } else if (item.describe === '機種產品別未維護') {
            item.describe = res['dfq.model-product-not-maintained'];
          } else if (item.describe === '未送簽') {
            item.describe = res['dfq.dfq-sign-not-send'];
          }
        });
      });
    });
  }

  // 顏色分類
  classify() {
    let allData = [];
    for (let j = 0; j < this.rfiDashboard.length; j++) {
      this.rfiDashboard[j]['sitePlant'] = this.rfiDashboard[j]['site'] + '-' + this.rfiDashboard[j]['plant'];
    }
    allData = this.groupByType(this.rfiDashboard, 'sitePlant');
    const listOfData = [];
    for (let index = 0; index < allData.length; index++) {
      listOfData.push({ key: allData[index]['key'], data: this.groupByType(allData[index]['data'], 'color') });
      listOfData[index]['totalColor'] = allData[index]['data'].length;
    }
    // 餅圖與路由傳參
    this.rfiWorkProgressRgbs = [];
    for (let k = 0; k < listOfData.length; k++) {
      // 內層循環
      for (let index = 0; index < listOfData[k]['data'].length; index++) {
        if (index === 0) {
          this.rfiWorkProgressRgb = {
            title: '',
            Red: 0,
            Yellow: 0,
            Green: 0,
            Gray: 0,
            Purple: 0,
            totalColor: 0,
            data: []
          };
        }
        if (listOfData[k]['data'][index]['key'] === 'Green') {
          this.rfiWorkProgressRgb.Green = listOfData[k]['data'][index]['data'].length;
        } else if (listOfData[k]['data'][index]['key'] === 'Yellow') {
          this.rfiWorkProgressRgb.Yellow = listOfData[k]['data'][index]['data'].length;
        } else if (listOfData[k]['data'][index]['key'] === 'Red') {
          this.rfiWorkProgressRgb.Red = listOfData[k]['data'][index]['data'].length;
        } else if (listOfData[k]['data'][index]['key'] === 'Gray') {
          this.rfiWorkProgressRgb.Gray = listOfData[k]['data'][index]['data'].length;
        } else if (listOfData[k]['data'][index]['key'] === 'Purple') {
          this.rfiWorkProgressRgb.Purple = listOfData[k]['data'][index]['data'].length;
        }
      }
      this.rfiWorkProgressRgb.totalColor = listOfData[k]['totalColor'];
      this.rfiWorkProgressRgb.title = listOfData[k]['key'];
      this.rfiWorkProgressRgb.data = listOfData[k]['data'];
      this.rfiWorkProgressRgbs.push(this.rfiWorkProgressRgb);
    }
  }

  // 點擊顏色數據查詢
  colorClick(selectColor) {
    this.statusValue = [];
    if (selectColor === 'totalColor') {
      this.statusValue = ['Green', 'Red', 'Yellow', 'Gray'];
    } else {
      this.statusValue = [selectColor];
    }
    this.rfiTableList = this.rfiDashboard.filter(item => item.sitePlant === this.selectedValue)
      .filter(item => this.statusValue.find(color => item.color === color));
  }

  // json數組根據屬性分類
  groupByType(arr, param) {
    let map = {},
      dest = [];
    for (let i = 0; i < arr.length; i++) {
      let ai = arr[i];
      if (ai[param] && !map[ai[param]]) {
        dest.push({
          key: ai[param],
          data: [ai]
        });
        map[ai[param]] = ai;
      } else {
        for (let j = 0; j < dest.length; j++) {
          let dj = dest[j];
          if (dj.key == ai[param]) {
            dj.data.push(ai);
            break;
          }
        }
      }
    }
    return dest;
  }

  toYrGenerate(data) {
    this.router.navigate(['/dashboard/rfi/yr-generate'], {
      queryParams: {
        sitePlant: data.sitePlant,
        projectName: data.model,
        product: data.product
      }
    });
  }

  toYrGenerateSign(data) {
    // 參數為第一層table資料或者第二層table資料
    // console.log(data);
    if (!data.sitePlant) {
      data['sitePlant'] = data.site + '-' + data.plant;
    }
    this.router.navigate(['/dashboard/rfi/signing/yr-generate-signing'], {
      queryParams: {
        sitePlant: data.sitePlant,
        projectName: data.model
      }
    });
  }

  toNewModelMaintain(data) {

    if (data.describe === '簽核完成') {
      this.router.navigate(['/dashboard/dfc/military-order/query'], {
        queryParams: {
          Plant: data.plant,
          ProjectNameID: data.model
        }
      });
    } else if (data.describe === '簽核未完成') {
      if (!data.sitePlant) {
        data['sitePlant'] = data.site + '-' + data.plant;
      }
      this.router.navigate(['/dashboard/rfi/signing/yr-generate-signing'], {
        queryParams: {
          sitePlant: data.sitePlant,
          projectName: data.model
        }
      });
    } else if (data.describe === '物料良率信息未上傳') {
      if (!data.sitePlant) {
        data['sitePlant'] = data.site + '-' + data.plant;
      }
      this.router.navigate(['/dashboard/rfi/yr-generate'], {
        queryParams: {
          sitePlant: data.sitePlant,
          projectName: data.model
        }
      });
    } else if (data.describe === '未送簽') {
      if (!data.sitePlant) {
        data['sitePlant'] = data.site + '-' + data.plant;
      }
      this.router.navigate(['/dashboard/rfi/yr-generate'], {
        queryParams: {
          sitePlant: data.sitePlant,
          product: data.product,
          projectName: data.model,
          projectCode: data.project,
        }
      });
    } else if (data.describe === '幾種產品別未維護') {
      if (!data.sitePlant) {
        data['sitePlant'] = data.site + '-' + data.plant;
      }
      this.router.navigate(['/dashboard/dfc/newmodel-maintain'], {
        queryParams: {
          Plant: data.sitePlant,
          ProjectName: data.model
        }
      });
    }
  }

  download() {
    const downLoadData = [];
    const excelFileName = 'DFQ良率預測';
    for (const item of this.rfiTableList) {
      const Data = {
        'Plant': item.sitePlant,
        'BU': item.businessUnit,
        'Customer': item.customer,
        'Product Type': item.product,
        'Project Code': item.project,
        'Project Name': item.model,
        'PLMStatus': item.PLMStatus,
        '目标良率完成签核': item.status === '1' ? 'Y' : 'N',
        'rfqDueDate': moment(item.rfqDueDate).format('YYYY-MM-DD'),
        'Light control  and Process Status': item.describe,
      };
      downLoadData.push(Data);
    }
    this.downexcelService.exportAsExcelFile(downLoadData, excelFileName);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


}
