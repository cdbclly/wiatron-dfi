import { View_ModelResult } from './../../../../service/mrr-sdk/models/View_ModelResult';
import { Model } from './../../../../service/mrr-sdk/models/Model';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  BusinessGroupInterface,
  BusinessUnitInterface,
  SiteInterface,
  PlantInterface,
  CustomerInterface,
  StageInterface,
  NPIMODELInterface,
  NPICHECKLIST_EM_HEADInterface,
} from '@service/dfq_sdk/sdk';
import { switchMap, map } from 'rxjs/operators';
import { MeetingReviewTestService } from '../meeting-review-test.service';
import { throwError, Observable } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-query-form',
  templateUrl: './query-form.component.html',
  styleUrls: ['./query-form.component.scss']
})
export class QueryFormComponent implements OnInit {

  // 查詢表單
  // @Input() meetinQueryForm: FormGroup;
  @Input() bgs: BusinessGroupInterface[];
  @Input() bus: BusinessUnitInterface[];
  @Input() sites: SiteInterface[];
  @Input() plants: PlantInterface[];
  // @Input() customers: CustomerInterface[];
  @Input() stages: StageInterface[];
  // @Input() models: NPIMODELInterface[];
  @Output() queryForm = new EventEmitter<any>();
  meetinQueryForm: FormGroup;
  customers = [];
  models = [];
  constructor(
    private meetingReviewTestService: MeetingReviewTestService,
    private _fb: FormBuilder,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private messageService: NzMessageService,
  ) {

    this.route.queryParams.subscribe({
      next: params => {
        // form init
        this.meetinQueryForm = this.fb.group({
          bg: [params['bg'], [Validators.required]],
          bu: [params['bu'], [Validators.required]],
          site: [params['site'], [Validators.required]],
          plant: [params['plant'], [Validators.required]],
          customer: [params['customer'], [Validators.required]],
          stage: [params['stage'], [Validators.required]],
          projectCode: [params['projectCode']],
          projectName: [params['projectName']],
          product: [params['product']],
          model: [params['model'], [Validators.required]],
          docno: [params['docno']]
        });
        this.getBus(params['bg']);
        this.getPlants((params['site']));
        this.getModels({ businessUnit: params['bu'] });
        // auto query
        if (this.meetinQueryForm.valid) {
          this.submitQueryForm(this.meetinQueryForm.value);
        }
      }, error: err => this.messageService.create('error', err.message)
    });
  }

  ngOnInit() {
  }

  submitQueryForm(form) {
    for (const i in this.meetinQueryForm.controls) {
      if (this.meetinQueryForm.controls.hasOwnProperty(i)) {
        this.meetinQueryForm.controls[i].markAsDirty();
        this.meetinQueryForm.controls[i].updateValueAndValidity();
      }
    }
    this.queryForm.emit(form);
  }
  getBus(bg) {
    this.meetingReviewTestService.getBus({
      where: {
        businessGroupId: bg
      }
    }).subscribe(
      (res: BusinessUnitInterface[]) => {
        this.bus = res;
      }
    );
  }

  getPlants(site) {
    this.meetingReviewTestService.getPlants({
      where: {
        siteId: site
      }
    }).subscribe(
      (res: PlantInterface[]) => this.plants = res
    );
  }

  getModels(filter) {
    const tempWhere = {
      site: this.meetingReviewTestService._checkNull(this.meetinQueryForm.value.site),
      plant: this.meetingReviewTestService._checkNull(this.meetinQueryForm.value.plant),
      customer: this.meetingReviewTestService._checkNull(this.meetinQueryForm.value.customer),
      projectCode: this.meetingReviewTestService._checkNull(this.meetinQueryForm.value.projectCode),
      projectName: this.meetingReviewTestService._checkNull(this.meetinQueryForm.value.projectName),
      businessGroup: this.meetingReviewTestService._checkNull(this.meetinQueryForm.value.bg),
      businessUnit: this.meetingReviewTestService._checkNull(this.meetinQueryForm.value.bu)
    };

    this.meetingReviewTestService.getModel({
      where: {
        ...tempWhere,
        ...this.meetingReviewTestService._checkNull(filter)
      }
    }).subscribe(
      (res: View_ModelResult[]) => {
        this.models = [];
        this.customers = [];
        for (let index = 0; index < res.length; index++) {
          if (!this.customers.includes(res[index].customer)) {
            this.customers.push(res[index].customer);
          }
          if (!this.models.includes(res[index].model)) {
            this.models.push(res[index].model);
          }
        }
      });
  }

}
