import { ActivatedRoute } from '@angular/router';
import { View_WorkflowSignApi, View_WorkflowSign } from '@service/dfi-sdk';
import {
  View_ModelResultApi,
  View_ModelResult,
  Customer,
  CheckListLog,
  NPICHECKLIST_EMApi,
  NPICHECKLIST_EM,
} from '@service/dfq_sdk/sdk';
import { Component, OnInit } from '@angular/core';
import { BusinessGroupInterface, BusinessUnitInterface, NPIMODELInterface } from '@service/dfq_sdk/sdk';
import * as _ from 'lodash';
import { JudgeBooleanResultPipe } from 'app/dfq/exit-meeting/judge-boolean-result.pipe';
import { NzMessageService } from 'ng-zorro-antd';
import { StageStatus } from './echarts/StageStatus';
import { forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {

  bg: string;
  bu: string;
  site: string;
  customer: string;
  product: string;
  stages;
  model: string;
  stageStatus: StageStatus[];
  result;

  // 查詢表單
  bgs: BusinessGroupInterface[];
  bus: BusinessUnitInterface[];
  sites: string[];
  plant: string;
  customers: Customer[];
  status: number[];
  models: NPIMODELInterface[];
  date;
  isChartLoading: boolean;
  isListLoading: boolean;

  constructor(
    private route: ActivatedRoute,
    private messageService: NzMessageService,
    private modelResultService: View_ModelResultApi,
    private workflowSignService: View_WorkflowSignApi,
    private npiChecklistService: NPICHECKLIST_EMApi
  ) {
    this.bgs = this.route.snapshot.data['bgsResolver'];
    this.sites = this.route.snapshot.data['sitesResolver'];
    this.customers = this.route.snapshot.data['customersResolver'];
    this.isChartLoading = false;
    this.isListLoading = false;
  }

  ngOnInit() { }

  queryForm(params) {
    this.isChartLoading = true;
    this.isListLoading = true;
    this.bg = params.bg;
    this.bu = params.bu;
    this.stages = params.stages;
    this.plant = params.plant;
    this.site = params.site;
    this.status = params.status;
    this.model = params.model ? params.model : undefined;
    this.customer = params.customer ? params.customer : undefined;
    this.product = params.product ? params.product : undefined;
    this.date = params.date;
    switch (params.status) {
      case 'Open': this.status = [2]; break;
      case 'Ongoing': this.status = [3]; break;
      case 'Closed': this.status = [4, 5]; break;
      default: this.status = [3, 4, 5];
    }
    let relation;
    if (params.status === 'Open') {
      relation = undefined;
    } else {
      relation = 'checklist';
    }
    this.modelResultService.find({
      include: relation,
      where: {
        businessGroup: this.bg,
        businessUnit: this.bu,
        site: this.site,
        plant: this.plant,
        stage: { inq: this.stages },
        customer: this.customer,
        product: this.product,
        model: this.model,
        projectCreatedOn: this.date,
        signStatus: { inq: this.status }
      }
    }).subscribe(async (result: View_ModelResult[]) => {
      if (this.status.length === 3) {
        await this.modelResultService.find({
          where: {
            businessGroup: this.bg,
            businessUnit: this.bu,
            site: this.site,
            plant: this.plant,
            stage: { inq: this.stages },
            customer: this.customer,
            product: this.product,
            model: this.model,
            projectCreatedOn: this.date,
            signStatus: 2
          }
        }).toPromise()
          .then((res: View_ModelResult[]) => {
            result = [...result, ...res];
            this.result = result;
          })
          .catch(error => this.messageService.create('error', error.message));
      }
      // query workflow signs
      if (result.length > 0) {
        let workflowSigns$ = [];
        for (let index = 0; index < result.length; index++) {
          workflowSigns$.push(this.workflowSignService.find<View_WorkflowSign>({ where: { id: result[index]['workflowId'] }, order: 'updateOn ASC' }));
        }
        // assign signs
        await forkJoin(workflowSigns$).toPromise()
          .then(signs => result.forEach((result, index) => result['sign'] = signs[index]))
          .catch(error => this.messageService.error(`取得簽核資料異常: ${error.message}`));
        // query npi checklist
        let npiChecklist$ = [];
        for (let index = 0; index < result.length; index++) {
          if (result[index].status) {
            npiChecklist$.push(of([]));
          } else {
            npiChecklist$.push(this.npiChecklistService.find({ where: { SITE: this.site, EXITMEETINGID: result[index]['exitMeetingId'] } }));
          }
        }
        // assign npi checklist
        await forkJoin(npiChecklist$).toPromise()
          .then(npiChecklist => {
            result.forEach((result, index) => result['npiChecklist'] = npiChecklist[index])
          })
          .catch(error => this.messageService.error(`取得NPI確認項目清單異常: ${error.message}`));
      } else {
        this.messageService.info('查無資料');
        this.isChartLoading = false;
      }
      // group by stage
      this.result = await _.groupBy(result, (data: View_ModelResult) => data.stage);
      const judgeBooleanResultPipe = new JudgeBooleanResultPipe();
      let pass: number, fail: number;
      this.stageStatus = [];
      for (const stage in this.result) {
        if (stage) {
          pass = 0;
          fail = 0;
          // count pass and fail number
          this.result[stage].forEach(data => {
            if (judgeBooleanResultPipe.transform(data.status, this.plant)) {
              pass++;
            } else {
              fail++;
            }
          });
          const status = new StageStatus(stage, pass, fail);
          this.stageStatus.push(status);
          this.isChartLoading = false;
          // group by checklist item judgement
          this.result[stage].forEach((data) => {
            if (data.checklist) {
              data.color = _.groupBy(data.checklist, (item: CheckListLog) => {
                if (item.JUDGMENT === 1) {
                  return 'green';
                } else if (item.JUDGMENT === 2) {
                  return 'yellow';
                } else if (item.JUDGMENT === 3) {
                  return 'red';
                } else if (item.JUDGMENT === 4) {
                  return 'gray';
                } else {
                  return '';
                }
              });
            } else if (data.npiChecklist) {
              data.color = _.groupBy(data.npiChecklist, (item: NPICHECKLIST_EM) => {
                if (item.JUDGMENT === 1) {
                  return 'green';
                } else if (item.JUDGMENT === 2) {
                  return 'yellow';
                } else if (item.JUDGMENT === 3) {
                  return 'red';
                } else if (item.JUDGMENT === 4) {
                  return 'gray';
                } else {
                  return '';
                }
              });
            }
          });
        }
      }
      this.isListLoading = false;
    });

  }
}
