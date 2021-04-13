import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import * as moment from 'moment';
import { MufrpiedataService } from 'app/dashboard/mrrboard/manufacturer-board/mufrpiedata.service';
import { PartNumberVendorFileApi } from '@service/mrr-sdk';
import { ProjectStageSkipReasonApi } from '@service/mrr-sdk/services/custom/ProjectStageSkipReason';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-mufrpiebyplant',
  templateUrl: './mufrpiebyplant.component.html',
  styleUrls: ['./mufrpiebyplant.component.scss']
})
export class MufrpiebyplantComponent implements OnInit {
  bg; // 路由获取的bg
  stageId; // 路由获取的stage
  plant;  // 路由获取的plant
  producType;  // 路由获取的producType
  stages = []; // 頁面table循環的stage
  remarks = []; // 頁面table循環的remark
  stageColspan; // 頁面table表頭stageId橫跨的列數
  checkStatus = []; // 頁面table循環的審核狀態
  dataSet = [];  // 页面上循环的数组
  c3ShowFlag = false; // 是否顯示C3資料
  c4ShowFlag = false; // 是否顯示C4資料
  c5ShowFlag = false; // 是否顯示C5資料
  addRemark = false; // 弹框
  confirmLoading = false;
  addStageRemark;
  addData;
  addStage;
  transNotice = {};
  constructor(
    private router: Router,
    public route: ActivatedRoute,
    private message: NzMessageService,
    private partNumberVendorFileApi: PartNumberVendorFileApi,
    private projectStageSkipReasonApi: ProjectStageSkipReasonApi,
    private mufrpiedataService: MufrpiedataService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    // 初始化i18n;
    this.translate.get(['mrr.vendor-fill-remark', 'mrr.vendor-set-partNo', 'mrr.vendor-should-upload', 'mrr.nudd-not-upload', 'mrr.vendor-waiting-review', 'mrr.vendor-fail', 'mrr.vendor-pass']).subscribe(res => {
      this.transNotice['noData'] = res['mrr.vendor-fill-remark'];
      this.transNotice['sysDev'] = res['mrr.vendor-set-partNo'];
      this.transNotice['shouldUpload'] = res['mrr.vendor-should-upload'];
      this.transNotice['notUpload'] = res['mrr.nudd-not-upload'];
      this.transNotice['waitingReview'] = res['mrr.vendor-waiting-review'];
      this.transNotice['fail'] = res['mrr.vendor-fail'];
      this.transNotice['pass'] = res['mrr.vendor-pass'];
      this.transNotice['remark'] = res['mrr.vendor-fill-remark'];
      this.transNotice['setPartNo'] = res['mrr.vendor-set-partNo'];
    });
    // 當點擊切換語言
    this.translate.onLangChange.pipe(takeUntil(new Subject())).subscribe(cur => {
      this.translate.get(['mrr.vendor-fill-remark', 'mrr.vendor-set-partNo', 'mrr.vendor-should-upload', 'mrr.nudd-not-upload', 'mrr.vendor-waiting-review', 'mrr.vendor-fail', 'mrr.vendor-pass']).subscribe(res => {
        this.transNotice['noData'] = res['mrr.vendor-fill-remark'];
        this.transNotice['sysDev'] = res['mrr.vendor-set-partNo'];
        this.transNotice['shouldUpload'] = res['mrr.vendor-should-upload'];
        this.transNotice['notUpload'] = res['mrr.nudd-not-upload'];
        this.transNotice['waitingReview'] = res['mrr.vendor-waiting-review'];
        this.transNotice['fail'] = res['mrr.vendor-fail'];
        this.transNotice['pass'] = res['mrr.vendor-pass'];
        this.transNotice['remark'] = res['mrr.vendor-fill-remark'];
        this.transNotice['setPartNo'] = res['mrr.vendor-set-partNo'];
      });
    });
    this.route.queryParams.subscribe(res => {
      this.bg = res.bg;
      this.stageId = res.stage;
      this.plant = res.plant;
      this.producType = res.producType;
      this.getData(this.bg);
    });
  }

  async getData(bg) {
    await this.mufrpiedataService.getData(bg).then(data => {
      const classfiyData = this.mufrpiedataService.dealMufrDatas(data);
      this.getTableList(classfiyData);
    });
  }

  getTableList(data) {
    const now = moment(new Date()).format('YYYY-MM-DD HH:MM:SS');
    const listOfData = [];
    // 循环JSON，获取要显示的数据
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        for (const key2 in data[key]) {
          if (data[key].hasOwnProperty(key2)) {
            for (const key3 in data[key][key2]) {
              if (data[key][key2].hasOwnProperty(key3)) {
                if (key === this.stageId && key2 === this.producType && key3 === this.plant) {
                  // tslint:disable-next-line: forin
                  for (const key4 in data[key][key2][key3]) {
                    const oneArr = [];
                    const remarkArr = [];
                    const stageDueday = [];
                    const stages = [];
                    if (data[key][key2][key3].hasOwnProperty(key4)) {
                      const c3Dueday = moment(data[key][key2][key3][key4][0].c3Dueday).format('YYYY-MM-DD HH:MM:SS');
                      const c4Dueday = moment(data[key][key2][key3][key4][0].c4Dueday).format('YYYY-MM-DD HH:MM:SS');
                      const c5Dueday = moment(data[key][key2][key3][key4][0].c5Dueday).format('YYYY-MM-DD HH:MM:SS');
                      if (this.stageId === 'C3~C5') {
                        remarkArr.push(
                          { stage: 'C3', enable: now > c3Dueday, remark: data[key][key2][key3][key4].c3Remark },
                          { stage: 'C4', enable: now > c4Dueday, remark: data[key][key2][key3][key4].c4Remark },
                          { stage: 'C5', enable: now > c5Dueday, remark: data[key][key2][key3][key4].c5Remark },
                        );
                        stageDueday.push(
                          { stage: 'C3', dueday: moment(data[key][key2][key3][key4][0].c3Dueday).format('YYYY-MM-DD') },
                          { stage: 'C4', dueday: moment(data[key][key2][key3][key4][0].c4Dueday).format('YYYY-MM-DD') },
                          { stage: 'C5', dueday: moment(data[key][key2][key3][key4][0].c5Dueday).format('YYYY-MM-DD') },
                        );
                        stages.push(
                          { stage: 'C3', status: data[key][key2][key3][key4].c3Status },
                          { stage: 'C4', status: data[key][key2][key3][key4].c4Status },
                          { stage: 'C5', status: data[key][key2][key3][key4].c5Status }
                        );

                      } else if (this.stageId === 'C4~C5') {
                        remarkArr.push(
                          { stage: 'C4', enable: now > c4Dueday, remark: data[key][key2][key3][key4].c4Remark },
                          { stage: 'C5', enable: now > c5Dueday, remark: data[key][key2][key3][key4].c5Remark },
                        );
                        stageDueday.push(
                          { stage: 'C4', dueday: moment(data[key][key2][key3][key4][0].c4Dueday).format('YYYY-MM-DD') },
                          { stage: 'C5', dueday: moment(data[key][key2][key3][key4][0].c5Dueday).format('YYYY-MM-DD') },
                        );
                        stages.push(
                          { stage: 'C4', status: data[key][key2][key3][key4].c4Status },
                          { stage: 'C5', status: data[key][key2][key3][key4].c5Status }
                        );
                      } else if (this.stageId === 'C5') {
                        remarkArr.push({ stage: 'C5', enable: now > c5Dueday, remark: data[key][key2][key3][key4].c5Remark });
                        stageDueday.push({ stage: 'C5', dueday: moment(data[key][key2][key3][key4][0].c5Dueday).format('YYYY-MM-DD') });
                        stages.push({ stage: 'C5', status: data[key][key2][key3][key4].c5Status });
                      }
                    }
                    for (const list of data[key][key2][key3][key4]) {
                      oneArr.push(list);

                    }
                    oneArr.sort(this.sortByManufacturer);
                    const oneData = {
                      projectCode: key4,
                      status: data[key][key2][key3][key4]['status'],
                      listData: oneArr,
                      stages: stages,
                      stageRemark: remarkArr,
                      stageDueday: stageDueday
                    };
                    listOfData.push(oneData);
                  }
                }
              }
            }
          }
        }
      }
    }
    if (this.stageId === 'C3~C5') {
      this.c3ShowFlag = true;
      this.c4ShowFlag = true;
      this.c5ShowFlag = true;
      this.remarks = [];
      this.stageColspan = 15;
      this.checkStatus = [this.transNotice['shouldUpload'], this.transNotice['notUpload'], this.transNotice['waitingReview'], this.transNotice['fail'], this.transNotice['pass'], this.transNotice['shouldUpload'], this.transNotice['notUpload'], this.transNotice['waitingReview'], this.transNotice['fail'], this.transNotice['pass'], this.transNotice['shouldUpload'], this.transNotice['notUpload'], this.transNotice['waitingReview'], this.transNotice['fail'], this.transNotice['pass']];
    } else if (this.stageId === 'C4~C5') {
      this.c3ShowFlag = false;
      this.c4ShowFlag = true;
      this.c5ShowFlag = true;
      this.stageColspan = 10;
      this.checkStatus = [this.transNotice['shouldUpload'], this.transNotice['notUpload'], this.transNotice['waitingReview'], this.transNotice['fail'], this.transNotice['pass'], this.transNotice['shouldUpload'], this.transNotice['notUpload'], this.transNotice['waitingReview'], this.transNotice['fail'], this.transNotice['pass']];
    } else if (this.stageId === 'C5') {
      this.c3ShowFlag = false;
      this.c4ShowFlag = false;
      this.c5ShowFlag = true;
      this.stageColspan = 5;
      this.checkStatus = [this.transNotice['shouldUpload'], this.transNotice['notUpload'], this.transNotice['waitingReview'], this.transNotice['fail'], this.transNotice['pass']];
    }
    this.dataSet = listOfData;
  }

  sortByManufacturer(a) {
    if (!a['manufacturerId']) {
      return 1;
    } else {
      return -1;
    }
  }

  showRemarkModel(data, stage) {
    this.addData = data;
    this.addStage = stage;
    this.addRemark = true;
  }

  addOne() {
    if (!this.addStageRemark.trim()) {
      this.message.create('error', this.transNotice['remark']);
    } else {
      this.confirmLoading = true;
      // 給修改的資料賦值
      this.addData.stageRemark.forEach(e => {
        if (e.stage === this.addStage) {
          e.remark = this.addStageRemark;
        }
      });
      this.addData.stages.forEach(e => {
        if (e.stage === this.addStage) {
          e.status = 'yellow';
        }
      });
      const newData = {
        projectCode: this.addData.projectCode,
        plantName: this.addData.listData[0].plant,
        stage: this.addStage,
        remark: this.addStageRemark,
        productId: this.addData.listData[0].productType,
        createBy: localStorage.getItem('$DFI$userID')
      };
      this.projectStageSkipReasonApi.create(newData).subscribe(async res => {
        await this.getData(this.bg);
        this.dataSet.find(a => a.projectCode === newData.projectCode).expand = true;
        this.dataSet = this.dataSet.slice();
        this.confirmLoading = false;
        this.message.create('success', 'Fill in successfully！');
        this.addRemark = false;
        this.addStageRemark = undefined;
        this.addData = undefined;
      });
    }
  }

  cancelAddOne() {
    this.confirmLoading = false;
    this.addRemark = false;
    this.addStageRemark = undefined;
    this.addData = undefined;
  }

  linkMufrMatain(data, stage) {
    if (!data.partNumberVendorId) {
      this.message.create('error', this.transNotice['setPartNo']);
      return;
    } else {
      const queryData = {
        plant: data.plant,
        projectIdList: [data.projectCode]
      };
      this.partNumberVendorFileApi.getPartNumberOverview(queryData).subscribe(ree => {
        let passRate;
        let uploadCompleteRate;
        let lastMailSentDate;
        ree.data[0].listData.forEach(d => {
          if (d.partNumberId === data.partNumber) {
            d.listData.forEach(a => {
              if (a.manufacturerId === data.manufacturerId && a.partNumberVendorId === data.partNumberVendorId) {
                lastMailSentDate = a.lastMailSentDate;
                if (lastMailSentDate) {
                  const dateString = lastMailSentDate.toString();
                  const date = dateString.match(/(\S*)T/)[1];  // 截取T前面的日期
                  const dateTime = dateString.match(/T(\S*):/)[1];  // 截取T後面：前面的時間
                  lastMailSentDate = `${date} ${dateTime}`;
                }
                if (stage === 'C3') {
                  passRate = a.c3PassRate;
                  uploadCompleteRate = a.c3UploadCompleteRate;
                } else if (stage === 'C4') {
                  passRate = a.c4PassRate;
                  uploadCompleteRate = a.c4UploadCompleteRate;
                } else if (stage === 'C5') {
                  passRate = a.c5PassRate;
                  uploadCompleteRate = a.c5UploadCompleteRate;
                }
              }
            });
          }
        });
        this.router.navigate(['/dashboard/mrrMdm/sqmfile'],
          {
            queryParams: {
              plant: data.plant,
              projectCode: data.projectCode,
              containerName: data.containerName,
              stage: stage,
              part_no: data.partNumber,
              manufacturer: data.manufacturerId,
              partNumberVendorId: data.partNumberVendorId,
              uploadCompleteRate: uploadCompleteRate,
              passRate: passRate,
              lastMailSentDate: lastMailSentDate
            }
          });
      });
    }
  }
}
