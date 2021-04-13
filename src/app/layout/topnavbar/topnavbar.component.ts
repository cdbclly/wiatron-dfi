import { VersionService } from './../../version.service';
import { View_WorkflowApi } from './../../service/dfi-sdk/services/custom/View_Workflow';
import { MeetingReviewTestService } from './../../dfq/exit-meeting/meeting-review-test/meeting-review-test.service';
import { NPIMODELInterface } from './../../service/dfq_sdk/sdk/models/NPIMODEL';
import { NPIMODELApi } from './../../service/dfq_sdk/sdk/services/custom/NPIMODEL';
import { NPICHECKLIST_EM_HEADApi } from './../../service/dfq_sdk/sdk/services/custom/NPICHECKLIST_EM_HEAD';
import { ExitMeetingResultApi } from './../../service/dfq_sdk/sdk/services/custom/ExitMeetingResult';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { AuthService } from 'app/authentication/auth.service';
import { SigningService } from 'app/mrr/nudd/signing/signing.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-topnavbar',
  templateUrl: './topnavbar.component.html',
  styleUrls: ['./topnavbar.component.scss']
})
export class TopnavbarComponent implements OnInit {
  needToSignCount;
  dispalyTime: string;
  userName = '';
  userID: string;
  Signing = [];
  needSigning = [];
  meetingIds = [];
  bg: string;
  bu: string;
  url: string;
  site: string;
  plant: string;
  stage: string;
  model: string;
  urls = [];
  signingAlerts = [];
  DFQAlerts: any[];
  DFCAlerts: any[];
  MRRAlerts: any[];
  env = VersionService.env;
  isExt = localStorage.getItem('$DFI$isExt') ? true : false;
  // dfi多语系功能
  language = 'zh';
  langSet: any = [
    { 'key': 'zh', 'value': '中文' },
    { 'key': 'en', 'value': 'English' }
  ];
  constructor(
    private authService: AuthService,
    private exitMeetingResultService: ExitMeetingResultApi,
    private npiCheckListService: NPICHECKLIST_EM_HEADApi,
    private npiModelService: NPIMODELApi,
    private meetingReviewTestService: MeetingReviewTestService,
    private viewWorkflow: View_WorkflowApi,
    private nuddSignService: SigningService,
    private transService: TranslateService
  ) { }

  ngOnInit() {
    this.userName = (!localStorage.getItem('$DFI$userName')) ? localStorage.getItem('$DFI$userID') : localStorage.getItem('$DFI$userName');
    this.userID = localStorage.getItem('$DFI$userID');
    this.getClock();
    this.getInbox();
    // DFQ刷新inbox
    this.meetingReviewTestService.dataChanged.subscribe(data => {
      this.getInbox();
    });
    // NUDD刷新inbox
    this.nuddSignService.nuddSignUpd.subscribe(reso => {
      this.getInbox();
    });
  }

  private getInbox() {
    this.viewWorkflow.find({}).subscribe(res => {
      this.signingAlerts = res.filter(item => item['userId'] === this.userID);
      this.DFQAlerts = this.signingAlerts.filter(item => item['description'].includes('DFQ'));
      this.DFCAlerts = this.signingAlerts.filter(item => item['description'].includes('DFC'));
      this.MRRAlerts = this.signingAlerts.filter(item => item['description'].includes('MRR'));
    });
  }

  refreshInbox() {
    this.getInbox();
  }

  async getMeetingId() {
    this.meetingIds = [];
    let em = [];
    for (let index = 0; index < this.needSigning.length; index++) {
      await this.exitMeetingResultService.find({
        where: {
          id: this.needSigning[index].exitMeetingResultId
        }
      }).toPromise().then(
        res => {
          em = res;
          em.forEach(element => {
            if (this.meetingIds.indexOf(element.exitMeetingId) === -1) {
              this.meetingIds.push(element.exitMeetingId);
            }
          });
        }
      );
      if (index === this.needSigning.length - 1) {
        this.getUrl();
      }
    }
  }

  async getUrl() {
    this.urls = [];
    for (let index = 0; index < this.meetingIds.length; index++) {
      await this.npiCheckListService.find({
        where: {
          EXITMEETINGID: this.meetingIds[index]
        }
      }).toPromise().then(async res => {
        this.stage = res[0]['STAGE'];
        await this.npiModelService.find({
          where: {
            MODEL: res[0]['MODEL']
          }
        }).toPromise().then(
          (data: NPIMODELInterface[]) => {
            this.bg = data[0].BG;
            this.bu = data[0].BU;
            this.site = data[0].SITE;
            this.plant = data[0].PLANT;
            this.model = data[0].MODEL;
          }
        );
      }, err => console.log(err));
      this.url = location.origin + '/dashboard/dfq/meeting-review' + '?bg=' + this.bg + '&bu=' + this.bu + '&site=' + this.site + '&plant=' + this.plant + '&stage=' + this.stage + '&model=' + this.model;
      this.urls.push(this.url);
    }
  }

  getClock() {
    this.updateTime();
  }

  updateTime() {
    this.dispalyTime = moment().format('YYYY/MM/DD hh:mm:ss');
    setTimeout(this.updateTime.bind(this), 1000);
  }

  logout() {
    this.authService.logout();
  }

  // dfi多语系切换(公用)
  multiLanguageSwitch(language: string) {
    this.language = language;
    this.transService.use(language);
  }
}
