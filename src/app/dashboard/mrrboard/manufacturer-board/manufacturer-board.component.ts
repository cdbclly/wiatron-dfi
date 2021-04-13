
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ProjectStageSkipReasonApi } from '@service/mrr-sdk/services/custom/ProjectStageSkipReason';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IPieChartOption } from '../../../components/pie-chart/pie-chart';
import { LoopBackConfig as NUDDLoopBackConfig } from './../../../service/mrr-sdk';
import { MufrpiedataService } from './mufrpiedata.service';
@Component({
  selector: 'app-manufacturer-board',
  templateUrl: './manufacturer-board.component.html',
  styleUrls: ['./manufacturer-board.component.scss']
})
export class ManufacturerBoardComponent implements OnInit {
  bgChartOptionsMufr = [];  // 頁面上綁定的餅圖資料
  standardScores;  // 撈取的信號燈標準值
  closedNumber1 = 0; // c3~c5不執行機種數
  closedNumber11 = 0; // c3~c5應執行機種數
  closedNumber2 = 0; // c4~c5不執行機種數
  closedNumber22 = 0;   // c4~c5應執行機種數
  closedNumber3 = 0; // c5應執行機種數
  closedNumber33 = 0;  // c5不執行機種數
  executePro; // closed掉的分母，应执行机种数
  closedPro; // closed掉的分子，不执行机种数
  titleTemplate;  // 页面上绑定的tooltip
  titelTexts = ['C3~C5', 'C4~C5', 'C5'];
  dealData = {};
  isLoading = true;
  skipRemarks;
  @Input() bg: string;
  transNotice = {};
  constructor(
    private route: Router,
    private projectStageSkipReasonApi: ProjectStageSkipReasonApi,
    private mufrpiedataService: MufrpiedataService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    // 初始化i18n;
    this.translate.get(['mrr.mrr-noData', 'mrr.vendor-sop-name', 'mrr.vendor-personnel']).subscribe(res => {
      this.transNotice['noData'] = res['mrr.mrr-noData'];
      this.transNotice['sopName'] = res['mrr.vendor-sop-name'];
      this.transNotice['vendorPer'] = res['mrr.vendor-personnel'];
    });
    // 當點擊切換語言
    this.translate.onLangChange.pipe(takeUntil(new Subject())).subscribe(cur => {
      this.translate.get(['mrr.mrr-noData', 'mrr.vendor-sop-name', 'mrr.vendor-personnel']).subscribe(res => {
        this.transNotice['noData'] = res['mrr.mrr-noData'];
        this.transNotice['sopName'] = res['mrr.vendor-sop-name'];
        this.transNotice['vendorPer'] = res['mrr.vendor-personnel'];
      });
    });
    this.projectStageSkipReasonApi.find().subscribe(red => {
      this.skipRemarks = red;
      this.mufrpiedataService.getData(this.bg).then(data => {
        this.getClosedProject(data); // 调用计算closed掉的projectCode数量
        this.test(data);
      });
    });
  }

  test(data) {
    const classfiyData = this.mufrpiedataService.dealMufrDatas(data);
    const options = [];
    if (classfiyData) {
      for (const key in classfiyData) {
        if (classfiyData.hasOwnProperty(key)) {
          let option;
          const param = {
            titleText: key,
            dataSecondName: classfiyData[key].qualifiedPro,
            dataFourName: classfiyData[key].totalPro,
            dataTopValue: classfiyData[key].qualifiedPro,
            dataMiddleValue: classfiyData[key].generalPro,
            dataDownValue: classfiyData[key].unqualifiedPro,
          };
          if (data.length === 0) {
            option = this.getPieOptionOpen(param, this.transNotice['noData']);
          } else {
            option = this.getMufrPieOption(param);
          }
          options.push(option);
        }
      }
      this.isLoading = false;
      this.bgChartOptionsMufr = options;
      return { options: options };
    } else {
      let option;
      for (const T1 of this.titelTexts) {
        const param = {
          titleText: T1,
        };
        option = this.getPieOptionOpen(param, this.transNotice['noData']);
        options.push(option);
      }
      this.isLoading = false;
      this.bgChartOptionsMufr = options;
      return { options: options };
    }
  }

  // 注计算解closed掉的projectCode
  getClosedProject(data) {
    const dealData = {};
    let length = 0;
    let lengttotalNumber = 0;
    let length2 = 0;
    for (const item of data) {
      // 第一个饼图的分类
      if (!dealData[`C3~C5`]) {
        dealData[`C3~C5`] = {};
      }
      if (!dealData[`C3~C5`][item.productType]) {
        dealData[`C3~C5`][item.productType] = {};
      }
      if (!dealData[`C3~C5`][item.productType][item.plant]) {
        dealData[`C3~C5`][item.productType][item.plant] = {};
      }
      if (!dealData[`C3~C5`][item.productType][item.plant][item.projectCode]) {
        dealData[`C3~C5`][item.productType][item.plant][item.projectCode] = [];
        dealData[`C3~C5`][item.productType][item.plant][item.projectCode]['moduleEnabled'] = item.moduleEnabled;
        length++;
      }
      dealData[`C3~C5`][item.productType][item.plant][item.projectCode].push(item);
      dealData[`C3~C5`]['totalPro'] = length;
      // 第二个饼图的分类
      if (item.currentStage === 'C4' || item.currentStage === 'C5') {
        if (!dealData[`C4~C5`]) {
          dealData[`C4~C5`] = {};
        }
        if (!dealData[`C4~C5`][item.productType]) {
          dealData[`C4~C5`][item.productType] = {};
        }
        if (!dealData[`C4~C5`][item.productType][item.plant]) {
          dealData[`C4~C5`][item.productType][item.plant] = {};
        }
        if (!dealData[`C4~C5`][item.productType][item.plant][item.projectCode]) {
          dealData[`C4~C5`][item.productType][item.plant][item.projectCode] = [];
          dealData[`C4~C5`][item.productType][item.plant][item.projectCode]['moduleEnabled'] = item.moduleEnabled;
          lengttotalNumber++;
        }
        dealData[`C4~C5`][item.productType][item.plant][item.projectCode].push(item);
        dealData[`C4~C5`]['totalPro'] = lengttotalNumber;
      }
      // 第三个饼图的分类
      if (item.currentStage === 'C5') {
        if (!dealData[`C5`]) {
          dealData[`C5`] = {};
        }
        if (!dealData[`C5`][item.productType]) {
          dealData[`C5`][item.productType] = {};
        }
        if (!dealData[`C5`][item.productType][item.plant]) {
          dealData[`C5`][item.productType][item.plant] = {};
        }
        if (!dealData[`C5`][item.productType][item.plant][item.projectCode]) {
          dealData[`C5`][item.productType][item.plant][item.projectCode] = [];
          dealData[`C5`][item.productType][item.plant][item.projectCode]['moduleEnabled'] = item.moduleEnabled;
          length2++;
        }
        dealData[`C5`][item.productType][item.plant][item.projectCode].push(item);
        dealData[`C5`]['totalPro'] = length2;
      }
    }
    this.closedNumber1 = 0;
    this.closedNumber2 = 0;
    this.closedNumber3 = 0;
    for (const key in dealData) {
      if (dealData.hasOwnProperty(key)) {
        if (key === 'C3~C5') {
          this.closedNumber11 = dealData[key]['totalPro'];
        } else if (key === 'C4~C5') {
          this.closedNumber22 = dealData[key]['totalPro'];
        } else if (key === 'C5') {
          this.closedNumber33 = dealData[key]['totalPro'];
        }
        for (const key2 in dealData[key]) {
          if (dealData[key].hasOwnProperty(key2)) {
            for (const key3 in dealData[key][key2]) {
              if (dealData[key][key2].hasOwnProperty(key3)) {
                for (const key4 in dealData[key][key2][key3]) {
                  if (dealData[key][key2][key3].hasOwnProperty(key4)) {
                    if (key === 'C3~C5' && !dealData[key][key2][key3][key4]['moduleEnabled']) {
                      this.closedNumber1++;
                    } else if (key === 'C4~C5' && !dealData[key][key2][key3][key4]['moduleEnabled']) {
                      this.closedNumber2++;
                    } else if (key === 'C5' && !dealData[key][key2][key3][key4]['moduleEnabled']) {
                      this.closedNumber3++;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  // 鼠标移上去的提示文字
  onMouseEnter(e) {
    if (e.title === 'C3~C5') {
      this.executePro = this.closedNumber11;
      this.closedPro = this.closedNumber1;
    } else if (e.title === 'C4~C5') {
      this.executePro = this.closedNumber22;
      this.closedPro = this.closedNumber2;
    } else if (e.title === 'C5') {
      this.executePro = this.closedNumber33;
      this.closedPro = this.closedNumber3;
    }
  }

  getMufrPieOption(data: any): IPieChartOption {
    const param: IPieChartOption = {
      title: data.titleText,
      subtext: (data.dataSecondName !== undefined ? data.dataSecondName : 'N/A') + '\n' + '─────' + '\n' + (data.dataFourName !== undefined ? data.dataFourName : 'N/A'),
      data: [
        {
          name: 'Top',
          value: data.dataTopValue,
          itemStyle: {
            color: data.dataTopValue === 0 ? 'rgba(248, 244, 244, 0.973)' : 'green'
          },
          title: data.titleText
        },
        {
          name: 'Middle',
          value: data.dataMiddleValue,
          itemStyle: {
            color: data.dataFourName === 0 ? 'rgba(248, 244, 244, 0.973)' : 'yellow'
          },
          title: data.titleText
        },
        {
          name: 'Down',
          value: data.dataDownValue,
          itemStyle: {
            color: data.dataFourName === 0 ? 'rgba(248, 244, 244, 0.973)' : 'red'
          },
          title: data.titleText
        }
      ],
      height: '160px',
      width: '160px'
    };
    return param;
  }

  // 暫無數據餅圖
  // 未开发系统饼图绘制
  getPieOptionOpen(data: any, subTitle): IPieChartOption {
    const param: IPieChartOption = {
      title: data.titleText,
      subtext: subTitle,
      data: [{
        name: this.transNotice['noData'],
        value: 0,
        itemStyle: {
          color: 'rgba(248, 244, 244, 0.973)'
        }
      }],
      height: '160px',
      width: '160px'
    };
    return param;
  }

  linkMufr(e) {
    if (e.name === this.transNotice['noData']) {
      return;
    } else {
      this.route.navigate(['/dashboard/mrrMdm/mufrpie'],
        {
          queryParams: {
            stage: e.data.title,
            bg: this.bg
          }
        });
    }
  }

  // 下载sop
  async downSqmSop() {
    const token = localStorage.getItem('$DFI$token').toString();
    const apiURL = NUDDLoopBackConfig.getPath().toString();
    const container = 'mrrDoc';
    const fileUrl = apiURL + `/api/containers/${container}/download/${this.transNotice['sopName']}.pdf`;
    fetch(fileUrl, {
      method: 'GET',
      headers: new Headers({
        'content-Type': 'application/json;charset=UTF-8',
        Authorization: token
      })
    }).then(async res => await res.blob()).then(async (blob) => {
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = URL.createObjectURL(blob);
      a.download = `${this.transNotice['sopName']}.pdf`
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }

  async downMufSop() {
    const token = localStorage.getItem('$DFI$token').toString();
    const apiURL = NUDDLoopBackConfig.getPath().toString();
    const container = 'mrrDoc';
    const fileUrl = apiURL + `/api/containers/${container}/download/${this.transNotice['sopName']}-${this.transNotice['vendorPer']}.pdf`;
    fetch(fileUrl, {
      method: 'GET',
      headers: new Headers({
        'content-Type': 'application/json;charset=UTF-8',
        Authorization: token
      })
    }).then(async res => await res.blob()).then(async (blob) => {
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = URL.createObjectURL(blob);
      a.download = `${this.transNotice['sopName']}-${this.transNotice['vendorPer']}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }
}
