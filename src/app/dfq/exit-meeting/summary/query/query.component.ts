import { SummaryService } from './../summary.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ProductApi, Product } from '@service/dfi-sdk';
import {
  BusinessGroupInterface,
  SiteInterface,
  Plant,
  BusinessUnit,
  NPIMODEL,
  BusinessUnitApi
} from '@service/dfq_sdk/sdk';
import { NzMessageService } from 'ng-zorro-antd';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
@Component({
  selector: 'app-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.scss']
})
export class QueryComponent implements OnInit {
  @Input() isLoading = false;
  @Input() bgs: BusinessGroupInterface[];
  bus: BusinessUnit[];
  @Input() sites: SiteInterface[];
  plants: Plant[];
  customers = [];
  products: Product[];
  stages = ['C4', 'C5'];
  models: NPIMODEL[];
  statusList: string[] = ['Open', 'Ongoing', 'Closed'];
  @Output() queryForm = new EventEmitter<any>();
  selectedStages: string[];
  id;
  endDate: Date;
  startDate: Date;
  formGroup: FormGroup;
  plant;

  constructor(
    private summaryService: SummaryService,
    private messageService: NzMessageService,
    private route: ActivatedRoute,
    private productService: ProductApi,
    private businessUnitService: BusinessUnitApi,
    private fb: FormBuilder
  ) {
    this.selectedStages = ['C4', 'C5'];
    this.route.queryParams.subscribe({
      next: params => {
        if (params['stages']) {
          this.selectedStages = [];
          this.selectedStages.push(params['stages']);
        }
        if (params['plant']) {
          this.plant = params['plant'].slice(1, 2);
        }
        // form init
        this.formGroup = this.fb.group({
          bg: [params['bg']],
          bu: [params['bu']],
          site: [params['site'], [Validators.required]],
          plant: [this.plant, [Validators.required]],
          startDate: [params['startDate']],
          endDate: [params['endDate']],
          product: [params['product']],
          customer: [params['customer']],
          model: [params['model']],
          stages: [this.selectedStages, [Validators.required]],
          status: ['Closed']
        });
        this.getPlants(this.formGroup.value.site);
        this.getModels();
        this.getProducts();
        // auto query
        if (this.formGroup.valid) {
          this.query();
        }
      },
      error: err => this.messageService.create('error', err.message)
    });
  }

  ngOnInit() {
  }

  query() {
    for (const i in this.formGroup.controls) {
      if (this.formGroup.controls.hasOwnProperty(i)) {
        this.formGroup.controls[i].markAsDirty();
        this.formGroup.controls[i].updateValueAndValidity();
      }
    }

    let createDateFilter;
    if (this.formGroup.value.startDate && this.formGroup.value.endDate) {
      createDateFilter = { between: [moment(this.formGroup.value.startDate).format('YYYY-MM-DD'), moment(this.formGroup.value.endDate).format('YYYY-MM-DD')] };
    } else {
      createDateFilter = undefined;
    }
    this.queryForm.emit({
      bg: this.formGroup.value.bg ? this.formGroup.value.bg : undefined,
      bu: this.formGroup.value.bu ? this.formGroup.value.bu : undefined,
      site: this.formGroup.value.site,
      plant: this.formGroup.value.plant,
      date: createDateFilter,
      product: this.formGroup.value.product ? this.formGroup.value.product : undefined,
      stages: this.formGroup.value.stages,
      customer: this.formGroup.value.customer ? this.formGroup.value.customer : undefined,
      model: this.formGroup.value.model ? this.formGroup.value.model : undefined,
      status: this.formGroup.value.status
    });
  }

  getBus(bg?: string) {
    // this.bu = undefined;
    this.summaryService.getBus({
      where: {
        businessGroupId: bg
      }
    }).subscribe((bus: BusinessUnit[]) => {
      this.bus = bus;
    });

    this.getModels();
  }

  getPlants(siteId?: string) {
    this.summaryService.getPlants({
      where: {
        siteId: siteId
      }
    }).subscribe((plants: Plant[]) => {
      this.plants = plants;
    });

    this.getModels();
  }

  getModelsByPlant(plant?: string) {
    this.summaryService.getModelsByPlant({
      where: {
        SITE: this.formGroup.value.site,
        PLANT: this.formGroup.value.plant,
        CUSTOMER: this.formGroup.value.customer,
        BG: this.formGroup.value.bg,
        BU: this.formGroup.value.bu
      }
    }).subscribe((models: NPIMODEL[]) => {
      this.models = models;
    });
  }

  getModels(bg?: string, bu?: string, site?: string, plant?: string, customer?: string) {
    this.formGroup.value.model = undefined;
    this.summaryService.getModelsByPlant({
      where: {
        BG: this.formGroup.value.bg ? this.formGroup.value.bg : undefined,
        BU: this.formGroup.value.bu ? this.formGroup.value.bu : undefined,
        SITE: this.formGroup.value.site ? this.formGroup.value.site : undefined,
        PLANT: this.formGroup.value.plant ? this.formGroup.value.plant : undefined,
        CUSTOMER: this.formGroup.value.customer ? this.formGroup.value.customer : undefined
      }
    }).subscribe((models: NPIMODEL[]) => {
      this.models = models;
      this.customers = [];
      for (let index = 0; index < models.length; index++) {
        if (!this.customers.includes(models[index].CUSTOMER)) {
          this.customers.push(models[index].CUSTOMER);
        }
      }
    });
  }

  getProducts() {
    this.productService.find({}).subscribe((products: Product[]) => this.products = products);
  }

  selectBg(bg) {
    bg = (bg === null) ? undefined : bg;
    this.formGroup.value.bg = bg;
    this.getBus(bg);
    this.getModels();
  }

  selectBu(bu) {
    this.formGroup.value.bu = (bu === null) ? undefined : bu;
    this.getModels();
  }

  selectSite(site) {
    this.getPlants(site);
  }

  selectPlant(plant) {
    this.getModels();
  }

  selectCustomer(customer) {
  }

}
