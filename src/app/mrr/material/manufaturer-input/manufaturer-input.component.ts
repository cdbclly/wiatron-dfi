import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { MrrMaterialSelectService } from '../mrr-material-select.service';
import { ManufaturerInputService } from './manufaturer-input.service';
import { MrrMaterialMessageService } from '../mrr-material-message.service';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { DownexcelService } from '@service/downexcel.service';
import { NzMessageService } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';
export const toManufaturerInputKeyin$ = new ReplaySubject<any>();
export const toManufaturerInput$ = new ReplaySubject<any>();

@Component({
  selector: 'app-manufaturer-input',
  templateUrl: './manufaturer-input.component.html',
  styleUrls: ['./manufaturer-input.component.scss']
})
export class ManufaturerInputComponent implements OnInit {

  Mathround = Math.round;
  validateForm: FormGroup;
  isLoading = false;
  // 查詢條件
  manufacturers = [];
  plants = [];
  customers = [];
  projectCodes = [];
  projectNames = [];
  stages = [];
  parts = [];
  partNumbers = [];
  vendors = [];
  partNumberChange$ = new BehaviorSubject('');
  partNumberSearch$ = new BehaviorSubject('');
  manufacturerChange$ = new BehaviorSubject('');
  plantChange$ = new BehaviorSubject('');
  customerChange$ = new BehaviorSubject('');
  customerSearch$ = new BehaviorSubject('');
  projectCodeChange$ = new BehaviorSubject('');
  projectCodeSearch$ = new BehaviorSubject('');
  projectNameChange$ = new BehaviorSubject('');
  projectNameSearch$ = new BehaviorSubject('');
  partChange$ = new BehaviorSubject('');
  vendorChange$ = new BehaviorSubject('');
  manufacturerInfo: any = {
    manufacturer: [],
    projectCodeList: [],
    projectCodeMap: {},
    projectNameList: []
  };

  manufacturerInputData = [];
  singlePartYrOption;

  page = 0;
  pageData: {
    validateForm: FormGroup;
    select: {
      manufacturers;
      plants;
      customers;
      projectCodes;
      projectNames;
      stages;
      parts;
      partNumbers;
      vendors;
    };
    dateCode?;
    partNumberVendorRecordId?;
    vendorRecordStatus?;
    dataSet?: any[];
  } = {
      validateForm: this.validateForm,
      select: {
        manufacturers: this.manufacturers,
        plants: this.plants,
        customers: this.customers,
        projectCodes: this.projectCodes,
        projectNames: this.projectNames,
        stages: this.stages,
        parts: this.parts,
        partNumbers: this.partNumbers,
        vendors: this.vendors
      }
    };
  manufacturersCache = [];
  echartFlag = false;
  downFlag = false;
  partNumberVendors;
  plantProject;
  downloadNotice;
  queryNotice;
  excelTitle;
  constructor(
    private fb: FormBuilder,
    private selectService: MrrMaterialSelectService,
    private messageService: MrrMaterialMessageService,
    private manufaturerInputService: ManufaturerInputService,
    private route: ActivatedRoute,
    private downExcelService: DownexcelService,
    private message: NzMessageService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    // 初始化i18n;
    this.translate.get(['mrr.material-vendor-downNotice', 'mrr.material-vendor-queryNotice', 'mrr.material-vendor-select']).subscribe(res => {
      this.downloadNotice = res['mrr.material-vendor-downNotice'];
      this.queryNotice = res['mrr.material-vendor-queryNotice'];
      this.excelTitle = res['mrr.material-vendor-select'];
    });
    // 當點擊切換語言
    this.translate.onLangChange.pipe(takeUntil(new Subject())).subscribe(cur => {
      this.translate.get(['mrr.material-vendor-downNotice', 'mrr.material-vendor-queryNotice', 'mrr.material-vendor-select']).subscribe(res => {
        this.downloadNotice = res['mrr.material-vendor-downNotice'];
        this.queryNotice = res['mrr.material-vendor-queryNotice'];
        this.excelTitle = res['mrr.material-vendor-select'];
      });
    });
    this.validateForm = this.fb.group({
      partNumber: [null],
      manufacturer: [null],
      plant: [null],
      customer: [null],
      projectCode: [null],
      projectName: [null],
      part: [null],
      vendor: [null],
      stage: [null],
      rangePicker: [[], [Validators.required]],
      partNumberVendor: [null]
    });
    this.initSelect();
    this.route.queryParams.subscribe(param => {
      toManufaturerInputKeyin$.subscribe(d => {
        if (param['rout']) {
          this.pageData = d;
          this.page = 1;
        }
      });
      toManufaturerInput$.subscribe(manufaturerInputData => {
        if (param['manufaturerRoute']) {
          this.setPageData(manufaturerInputData);
        }
      });
    });
  }

  // mrr-kpi跳转的data处理
  setPageData(manufaturerInputData) {
    this.partNumbers = manufaturerInputData.select.partNumbers;
    this.manufacturers = manufaturerInputData.select.manufacturers;
    this.plants = manufaturerInputData.select.plants;
    this.customers = manufaturerInputData.select.customers;
    this.projectCodes = manufaturerInputData.select.projectCodes;
    this.projectNames = manufaturerInputData.select.projectNames;
    this.parts = manufaturerInputData.select.parts;
    this.stages = manufaturerInputData.select.stages;
    this.vendors = manufaturerInputData.select.vendors;

    this.validateForm.controls['partNumber'].setValue(manufaturerInputData.select.partNumbers[0]);
    this.validateForm.controls['manufacturer'].setValue(manufaturerInputData.select.manufacturers[0]);
    this.validateForm.controls['plant'].setValue(manufaturerInputData.select.plants[0].Value);
    this.validateForm.controls['customer'].setValue(manufaturerInputData.select.customers[0]);
    this.validateForm.controls['projectCode'].setValue(manufaturerInputData.select.projectCodes[0]);
    this.validateForm.controls['projectName'].setValue(manufaturerInputData.select.projectNames[0]);
    this.validateForm.controls['part'].setValue(manufaturerInputData.select.parts[0].id);
    this.validateForm.controls['stage'].setValue(manufaturerInputData.select.stages[0]);
    this.validateForm.controls['vendor'].setValue(manufaturerInputData.select.vendors[0].id);
    this.validateForm.controls['partNumberVendor'].setValue(manufaturerInputData.select.partNumberVendor);
    this.validateForm.controls['rangePicker'].setValue(manufaturerInputData.select.dateCode);
    this.query();
  }

  initSelect() {
    this.partNumberSearch$
      .asObservable()
      .pipe(debounceTime(100))
      .subscribe(d => {
        this.selectService.getPartNumberInfo(this.validateForm.value.partNumber).subscribe((res: any) => {
          this.partNumbers = res.partNumbers;
          this.partNumberVendors = res.dataSet;
          this.manufacturers = res.manufacturers;
          this.manufacturersCache = res.manufacturers;
          if (d) {
            this.partNumbers = res.partNumbers.filter(v => v.startsWith(d));
          }
        });
      });
    let partNumberVendor;
    this.partNumberChange$.subscribe(PN => {
      if (PN) {
        partNumberVendor = this.partNumberVendors.filter(p => p.partNumberId === PN);
        this.validateForm.controls['partNumberVendor'].setValue(partNumberVendor[0]['id']);
        this.manufacturerInfo = partNumberVendor.reduce(
          (p, t) => {
            if (!p['manufacturer'].includes(t['manufacturerId'])) {
              p['manufacturer'].push(t['manufacturerId']);
            }
            if (t['partNumber'] && t['partNumber']['projects']) {
              t['partNumber']['projects'].forEach(project => {
                if (!p['projectCodeList'].includes(project['id'])) {
                  p['projectCodeList'].push(project['id']);
                }
                if (!p['projectNameList'].includes(project['name'])) {
                  p['projectNameList'].push(project['name']);
                }
                if (!p['projectCodeMap'][project['id']]) {
                  p['projectCodeMap'][project['id']] = [];
                }
                if (t['partNumber']['part']) {
                  p['projectCodeMap'][project['id']].push(
                    t['partNumber']['part']
                  );
                  const res = new Map();
                  p['projectCodeMap'][project['id']] = p['projectCodeMap'][
                    project['id']
                  ].filter(i => !res.has(i.id) && res.set(i.id, 1));
                }
              });
            }
            return p;
          },
          {
            manufacturer: [],
            projectCodeList: [],
            projectCodeMap: {},
            projectNameList: []
          }
        );
        this.manufacturers = this.manufacturerInfo['manufacturer'];
        this.projectCodes = this.manufacturerInfo.projectCodeList;
      } else {
        this.manufacturers = this.manufacturersCache;
      }
      this.clearSelect('partNumber');
    });
    this.manufacturerChange$.subscribe(m => {
      if (m) {
        let partNumberVendorTmp;
        const vendorIds = [];
        if (partNumberVendor && partNumberVendor.length > 0) {
          partNumberVendorTmp = partNumberVendor;
        } else {
          partNumberVendorTmp = this.partNumberVendors.filter(p => p.manufacturerId === m);
        }
        for (let index = 0; index < partNumberVendorTmp.length; index++) {
          vendorIds.push(partNumberVendorTmp[index].vendorId);
        }
        this.selectService.getVendor(vendorIds).subscribe(v => {
          this.vendors = v;
          if (this.vendors.length === 1) {
            this.validateForm.controls['vendor'].setValue(this.vendors[0].id);
          }
        });
      }
      this.clearSelect('manufacturer');
    });
    this.selectService.getPlant().subscribe(d => (this.plants = d));
    this.plantChange$.subscribe(p => {
      if (p) {
        this.selectService.getCustomer(p).subscribe(c => {
          this.customers = c;
          this.selectService
            .getProNameProCode('material', p, null, this.customers)
            .subscribe(v => {
              this.plantProject = v.dataSet;
              if (this.plantProject.length > 0) {
                this.projectCodes = this.manufacturerInfo.projectCodeList.filter(
                  f => v['list']['ProjectCode'].includes(f)
                );
                this.projectNames = this.manufacturerInfo.projectNameList.filter(
                  f => v['list']['ProjectNameList'].includes(f)
                );
              }
            });
        });
      }
      this.clearSelect('plant');
    });
    this.customerChange$.subscribe(c => {
      if (c) {
        const projectCodes = [];
        const projectNames = [];
        const plantProject = this.plantProject.filter(p => p.plant === this.validateForm.value.plant && p.customer === c);
        for (let index = 0; index < plantProject.length; index++) {
          projectCodes.push(plantProject[index].projectCode);
          projectNames.push(plantProject[index].projectName);
        }
        this.projectCodes = this.manufacturerInfo.projectCodeList.filter(
          f => projectCodes.includes(f)
        );
        this.projectNames = this.manufacturerInfo.projectNameList.filter(
          f => projectNames.includes(f)
        );
      }
      this.clearSelect('customer');
    });
    this.projectCodeChange$.subscribe(proCode => {
      if (proCode) {
        this.selectService.getProjectNameByProjectCode(proCode).subscribe(v => {
          this.projectNames = v;
          if (this.projectNames.length === 1) {
            this.validateForm.controls['projectName'].setValue(v[0]);
          }
        });
        this.selectService.getStage(proCode).subscribe(v => this.stages = v);
        this.parts = this.manufacturerInfo.projectCodeMap[proCode];
      }
      this.clearSelect('projectCode');
    });
    this.vendorChange$.subscribe(v => {
      if (v) {
        const partNumberVendorId = partNumberVendor.find(p => p.partNumberId === this.validateForm.value.partNumber && p.manufacturerId === this.validateForm.value.manufacturer && p.vendorId === v).id;
        this.validateForm.controls['partNumberVendor'].setValue(partNumberVendorId);
      }
    });
  }

  clearSelect(selectType) {
    switch (selectType) {
      case 'partNumber':
        this.validateForm.controls['manufacturer'].setValue('');
      case 'manufacturer':
        this.validateForm.controls['vendor'].setValue('');
        this.validateForm.controls['partNumberVendor'].setValue('');
        this.validateForm.controls['plant'].setValue('');
      case 'plant':
        this.validateForm.controls['customer'].setValue('');
      case 'customer':
        this.validateForm.controls['projectCode'].setValue('');
        this.validateForm.controls['projectName'].setValue('');
      case 'projectCode':
        this.validateForm.controls['part'].setValue('');
        this.validateForm.controls['stage'].setValue('');
      case 'part':
        this.validateForm.controls['stage'].setValue('');
        break;
      case '':
        this.validateForm.controls['vendor'].setValue('');
        this.validateForm.controls['partNumberVendor'].setValue('');
      default:
        break;
    }
  }

  query() {
    this.isLoading = true;
    for (const key in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(key)) {
        this.validateForm.controls[key].markAsDirty();
        this.validateForm.controls[key].updateValueAndValidity();
      }
    }
    const startDate = new Date(this.validateForm.value.rangePicker[0]);
    const endDate = new Date(this.validateForm.value.rangePicker[1]);
    const diffDay = ((endDate.getTime() - startDate.getTime()) / 1000 / 60 / 60 / 24) + 1;
    if (diffDay > 92) {
      this.message.create('error', this.queryNotice);
      this.isLoading = false;
      return;
    }
    this.manufaturerInputService.manufacturerYieldQuery(this.validateForm).subscribe(res => {
      this.manufacturerInputData = res.dataSet;
      this.singlePartYrOption = res.option;
      // 只顯示單個料號的echarts圖
      if (this.validateForm.value.partNumber && this.manufacturerInputData.length > 0) {
        this.echartFlag = true;
      } else {
        this.echartFlag = false;
      }
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      this.messageService.MessageCode.queryError.param.data = error;
      this.messageService.MessageCode.queryError.param.nzTitle =
        'Query failed！';
      this.messageService.showMessage(this.messageService.MessageCode.queryError);
      toManufaturerInput$.next('');
    });
  }

  toYieldRateInput(data?) {
    this.pageData = {
      validateForm: this.validateForm,
      select: {
        partNumbers: this.partNumbers,
        manufacturers: this.manufacturers,
        plants: this.plants,
        customers: this.customers,
        projectCodes: this.projectCodes,
        projectNames: this.projectNames,
        parts: this.parts,
        stages: this.stages,
        vendors: this.vendors
      }
    };
    // 點擊GO時
    if (data) {
      if (!this.validateForm.value.partNumber) {
        this.pageData.validateForm.value.partNumber = data.partNumber;
        this.pageData.validateForm.value.partNumberVendor = data.partNumberVendorId;
      }
      if (!this.validateForm.value.manufacturer) {
        this.pageData.validateForm.value.manufacturer = data.manufacturer;
      }
      if (!this.validateForm.value.plant) {
        this.pageData.validateForm.value.plant = data.plant;
      }
      if (!this.validateForm.value.customer) {
        this.pageData.validateForm.value.customer = data.customer;
      }
      if (!this.validateForm.value.projectCode) {
        this.pageData.validateForm.value.projectCode = data.projectCode;
      }
      if (!this.validateForm.value.projectName) {
        this.pageData.validateForm.value.projectName = data.projectName;
      }
      if (!this.validateForm.value.part) {
        this.pageData.validateForm.value.part = { id: data.partId, name: data.part, productId: data.product };
      }
      if (!this.validateForm.value.stage) {
        this.pageData.validateForm.value.stage = data.stage;
      }
      if (data.dateCode) {
        this.pageData.dateCode = new Date(data.dateCode).toLocaleDateString();
      }
      if (data.dataSet) {
        this.pageData.dataSet = data.dataSet;
      }
      if (data.vendorRecordStatus || data.vendorRecordStatus === 0) {
        this.pageData.vendorRecordStatus = data.vendorRecordStatus;
      }
      if (
        data.partNumberVendorRecordId ||
        data.partNumberVendorRecordId === 0
      ) {
        this.pageData.partNumberVendorRecordId = data.partNumberVendorRecordId;
      }
    }
    this.page = 1;
  }
  // 廠商良率
  pageRoute(event) {
    this.page = event;
  }

  download() {
    this.downFlag = true;
    setTimeout(() => {
      const table = document.getElementById('singleVendorYrTable');
      this.downExcelService.exportTableAsExcelFile(table, this.excelTitle);
      this.downFlag = false;
    }, 1000);
  }
}
