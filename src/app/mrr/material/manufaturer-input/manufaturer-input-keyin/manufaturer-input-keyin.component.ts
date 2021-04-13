import { DownexcelService } from '@service/downexcel.service';
import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject, Subject } from 'rxjs';
import { MrrMaterialSelectService } from '../../mrr-material-select.service';
import { ManufaturerInputService } from '../manufaturer-input.service';
import { MrrMaterialMessageService } from '../../mrr-material-message.service';
import { Router } from '@angular/router';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-manufaturer-input-keyin',
  templateUrl: './manufaturer-input-keyin.component.html',
  styleUrls: ['./manufaturer-input-keyin.component.scss']
})
export class ManufaturerInputKeyinComponent implements OnInit, OnChanges {
  @Input() page;
  @Output() pageRoute = new EventEmitter<any>();
  @Input() pageData: {
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
  };
  validateForm: FormGroup;
  rangePicker = [];
  isLoading = false;
  checkData = false; // 检测 数据中 是否填写完整
  hasQueried = false;
  isExt = localStorage.getItem('$DFI$isExt') ? true : false;
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
    partNumberVendors: [],
    projectNameList: []
  };
  singlePartYrData = [];
  singlePartYrDataCache = [];
  partNumberVendorRecordId = null;
  vendorRecordStatus = null;
  yieldRateInupt = false;
  submitFlag = false;
  nowDate;
  weekNum;
  promptText;
  topIssueDate = [];
  Mathround = Math.round;
  RTYActual;
  keyinLoading = false;
  startValue: Date | null = null;
  disabledDate = (startValue: Date): boolean => {
    return false;
  };
  partNumberVendors;
  plantProject;
  keyinNotice;
  saveNotice;
  remarkNotice;
  excelTitle;
  constructor(
    private fb: FormBuilder,
    private selectService: MrrMaterialSelectService,
    private manufaturerInputService: ManufaturerInputService,
    private downExcelService: DownexcelService,
    private messageService: MrrMaterialMessageService,
    private router: Router,
    private message: NzMessageService,
    private translate: TranslateService
  ) { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    // 初始化i18n;
    this.translate.get(['mrr.material-vendor-keyinNotice', 'mrr.material-vendor-save', 'mrr.material-vendor-remark', 'mrr.mrr-vendor', 'mrr.mrr-yieldRate']).subscribe(res => {
      this.keyinNotice = res['mrr.material-vendor-keyinNotice'];
      this.saveNotice = res['mrr.material-vendor-save'];
      this.remarkNotice = res['mrr.material-vendor-remark'];
      this.excelTitle = res['mrr.mrr-vendor'] + res['mrr.mrr-yieldRate'];
    });
    // 當點擊切換語言
    this.translate.onLangChange.pipe(takeUntil(new Subject())).subscribe(cur => {
      this.translate.get(['mrr.material-vendor-keyinNotice', 'mrr.material-vendor-save', 'mrr.material-vendor-remark', 'mrr.mrr-vendor', 'mrr.mrr-yieldRate']).subscribe(res => {
        this.keyinNotice = res['mrr.material-vendor-keyinNotice'];
        this.saveNotice = res['mrr.material-vendor-save'];
        this.remarkNotice = res['mrr.material-vendor-remark'];
        this.excelTitle = res['mrr.mrr-vendor'] + res['mrr.mrr-yieldRate'];
      });
    });
    if (changes['pageData'] && changes['pageData'].currentValue) {
      this.validateForm = this.fb.group({
        partNumber: [null, [Validators.required]],
        manufacturer: [null, [Validators.required]],
        plant: [null],
        customer: [null],
        projectCode: [null, [Validators.required]],
        projectName: [null],
        part: [null],
        stage: [null, [Validators.required]],
        vendor: [null, [Validators.required]],
        dateCode: [null, [Validators.required]],
        partNumberVendor: [null, [Validators.required]]
      });
      this.initSelect();
      this.setPageData(this.pageData);
    }
    // 限制dateCode的範圍
    this.disabledDate = (startValue: Date): boolean => {
      if (!startValue) {
        return false;
      }
      return startValue.getTime() > new Date().getTime();
    };
  }

  initSelect() {
    this.partNumberSearch$
      .asObservable()
      .pipe(debounceTime(100))
      .subscribe(d => {
        this.selectService.getPartNumberInfo(this.validateForm.value.partNumber).subscribe((res: any) => {
          this.partNumbers = res.partNumbers;
          this.partNumberVendors = res.dataSet;
          if (d) {
            this.partNumbers = res.partNumbers.filter(v => v.startsWith(d));
          }
        });
      });
    let partNumberVendor;
    this.partNumberChange$.subscribe(PN => {
      if (PN) {
        partNumberVendor = this.partNumberVendors.filter(p => p.partNumberId === PN);
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
      }
      this.clearSelect('partNumber');
    });
    this.manufacturerChange$.subscribe(m => {
      if (m) {
        const vendorIds = [];
        for (let index = 0; index < partNumberVendor.length; index++) {
          vendorIds.push(partNumberVendor[index].vendorId);
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

  setPageData(param) {
    this.partNumbers = param.select.partNumbers.length > 0 ? param.select.partNumbers : [param.validateForm.value.partNumber];
    this.manufacturers = param.select.manufacturers.length > 0 ? param.select.manufacturers : [param.validateForm.value.manufacturer];
    this.plants = param.select.plants.length > 0 ? param.select.plants : [param.validateForm.value.plant];
    this.customers = param.select.customers.length > 0 ? param.select.customers : [param.validateForm.value.customer];
    this.projectCodes = param.select.projectCodes.length > 0 ? param.select.projectCodes : [param.validateForm.value.projectCode];
    this.projectNames = param.select.projectNames.length > 0 ? param.select.projectNames : [param.validateForm.value.projectName];
    this.parts = param.select.parts.length > 0 ? param.select.parts : [param.validateForm.value.part];
    this.stages = param.select.stages.length > 0 ? param.select.stages : [param.validateForm.value.stage];
    this.vendors = param.select.vendors;

    this.validateForm.controls['partNumber'].setValue(
      param.validateForm.value.partNumber
    );
    this.validateForm.controls['manufacturer'].setValue(
      param.validateForm.value.manufacturer
    );
    this.validateForm.controls['plant'].setValue(
      param.validateForm.value.plant
    );
    this.validateForm.controls['customer'].setValue(
      param.validateForm.value.customer
    );
    this.validateForm.controls['projectCode'].setValue(
      param.validateForm.value.projectCode
    );
    this.validateForm.controls['projectName'].setValue(
      param.validateForm.value.projectName
    );
    this.validateForm.controls['part'].setValue(param.validateForm.value.part.id);
    this.validateForm.controls['stage'].setValue(
      param.validateForm.value.stage
    );
    this.validateForm.controls['vendor'].setValue(
      param.validateForm.value.vendor
    );
    this.validateForm.controls['partNumberVendor'].setValue(
      param.validateForm.value.partNumberVendor
    );

    if (param.dateCode) {
      const dateCode = new Date(param.dateCode);
      this.validateForm.controls['dateCode'].setValue(
        dateCode.toLocaleDateString()
      );
      this.rangePicker = [
        dateCode.toLocaleDateString(),
        dateCode.toLocaleDateString()
      ];
      this.calWeek(param.dateCode);
      this.hasQueried = true;
    }
    if (param.vendorRecordStatus) {
      this.vendorRecordStatus = param.vendorRecordStatus;
    }
    if (param.dataSet) {
      this.validateForm.controls['manufacturer'].disable({
        onlySelf: true,
        emitEvent: true
      });
      this.validateForm.controls['plant'].disable({
        onlySelf: true,
        emitEvent: true
      });
      this.validateForm.controls['customer'].disable({
        onlySelf: true,
        emitEvent: true
      });
      this.validateForm.controls['projectCode'].disable({
        onlySelf: true,
        emitEvent: true
      });
      this.validateForm.controls['projectName'].disable({
        onlySelf: true,
        emitEvent: true
      });
      this.validateForm.controls['part'].disable({
        onlySelf: true,
        emitEvent: true
      });
      this.validateForm.controls['stage'].disable({
        onlySelf: true,
        emitEvent: true
      });
      this.validateForm.controls['partNumber'].disable({
        onlySelf: true,
        emitEvent: true
      });
      this.validateForm.controls['vendor'].disable({
        onlySelf: true,
        emitEvent: true
      });
      this.validateForm.controls['partNumberVendor'].disable({
        onlySelf: true,
        emitEvent: true
      });
      this.validateForm.controls['dateCode'].disable({
        onlySelf: true,
        emitEvent: true
      });
      this.singlePartYrData = param.dataSet;
      this.singlePartYrDataCache = JSON.parse(JSON.stringify(param.dataSet));
      this.checkData = this.checkDataSet(param.dataSet, false);
      this.vendorRecordStatus = param.vendorRecordStatus;
      this.partNumberVendorRecordId = param.partNumberVendorRecordId;
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
    this.manufaturerInputService
      .queryKeyin(this.validateForm, this.rangePicker)
      .subscribe(
        d => {
          this.vendorRecordStatus = d.vendorRecordStatus;
          this.partNumberVendorRecordId = d.partNumberVendorRecordId;
          this.singlePartYrData = d.dataSet;
          this.singlePartYrDataCache = JSON.parse(JSON.stringify(d.dataSet));
          this.checkData = this.checkDataSet(d.dataSet, false);
          this.isLoading = false;
          this.hasQueried = true;
        },
        error => {
          this.messageService.MessageCode.queryError.param.data = error;
          this.messageService.MessageCode.queryError.param.nzTitle =
            'Query failed！';
          this.messageService.showMessage(
            this.messageService.MessageCode.queryError
          );
          this.isLoading = false;
        }
      );
  }

  calWeek(dateCode) {
    this.nowDate = new Date(dateCode);
    // 計算當天是當年的第幾周
    let firstWeekDay;
    let sumDay = 0;
    const year = this.nowDate.getFullYear();
    const month = this.nowDate.getMonth();
    const day = this.nowDate.getDate();

    this.rangePicker = [
      this.nowDate.toLocaleDateString(),
      new Date(year, month, day + 1).toLocaleDateString()
    ];
    const weekDay = new Date(year, 0, 1).getDay();
    if (weekDay === 0) {
      firstWeekDay = 1;
    } else {
      firstWeekDay = 8 - weekDay;
    }
    switch (month) {
      case 11:
        sumDay += 30;
      case 10:
        sumDay += 31;
      case 9:
        sumDay += 30;
      case 8:
        sumDay += 31;
      case 7:
        sumDay += 31;
      case 6:
        sumDay += 30;
      case 5:
        sumDay += 31;
      case 4:
        sumDay += 30;
      case 3:
        sumDay += 31;
      case 2:
        if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
          sumDay += 29;
        } else {
          sumDay += 28;
        }
      case 1:
        sumDay += 31;
    }
    sumDay += day;
    this.weekNum = Math.ceil((sumDay - firstWeekDay) / 7) + 1;
  }

  // Check Top issue
  checkDataSet(dataSet, saveFlag) {
    let checkMapping = {};
    let checkFlag = true;
    this.RTYActual = 1;
    for (let index = 0; index < dataSet.length; index++) {
      const data = dataSet[index];
      if (index !== dataSet.length - 1) {
        checkMapping = {
          vendorTargetYieldShow: 'Goal',
          remark: 'Remark',
          input: 'Input',
          output: 'Output'
        };
      } else {
        // RTY是直通率 即前面所有製程的Actual總乘 RTY只需要輸入Goal值
        checkMapping = {
          vendorTargetYieldShow: 'Goal',
          remark: 'Remark'
        };
      }
      for (const key in checkMapping) {
        if (checkMapping.hasOwnProperty(key)) {
          const checkItem = checkMapping[key];
          if (data['vendorTargetYieldShow'] < data['sqmTargetYieldShow'] && key === 'remark' && !data[key]) {
            if (saveFlag) {
              this.message.create('error', `${data['operationName']}${this.remarkNotice}`);
            }
            checkFlag = false;
            break;
          }
          if (key !== 'remark' && !data[key] && data[key] !== 0) {
            if (saveFlag) {
              this.message.create('error', `${data['operationName']} ${checkItem} unfilled`);
            }
            checkFlag = false;
            break;
          }
        }
      }
      if (!checkFlag) {
        break;
      }
    }
    if (saveFlag && checkFlag) {
      for (let index = 0; index < dataSet.length; index++) {
        const data = dataSet[index];
        data['markRed'] = false;
        if (index !== dataSet.length - 1) {
          data['actual'] = (!data.input || !data.output) ? 0 : Math.round((data.output / data.input) * 10000) / 10000;
          // 非RTY 如果有Input 並且Actual小於MP Goal 則mark red
          if (data['input'] && data['actual'] < data['sqmTargetYieldShow'] / 100) {
            data['markRed'] = true;
          }
          if (data.input && data.output) {
            this.RTYActual *= data.output / data.input;
          } else if (data.input === 0 && data.output === 0) {
            this.RTYActual *= 1;
          } else if (data.input === 0 || data.output === 0) {
            this.RTYActual *= 0;
          }
        }
        if (index === dataSet.length - 1) {
          data['actual'] = Math.round(this.RTYActual * 10000) / 10000;
          // RTY 滿足Actual小於MP Goal 則mark red
          if (data['actual'] < data['sqmTargetYieldShow'] / 100) {
            data['markRed'] = true;
          }
        }
        // C3,C4不設定良率，只要有不良數 則mark red
        if (!data['sqmTargetYieldShow'] && data.input - data.output > 0) {
          data['markRed'] = true;
        }
      }
    }
    return checkFlag;
  }

  goBack() {
    const page = 0;
    this.pageRoute.emit(page);
  }

  edit() {
    this.yieldRateInupt = true;
  }

  save() {
    let flag = false;
    this.checkData = this.checkDataSet(this.singlePartYrDataCache, true);
    if (this.checkData) {
      // 查找非RTY input和output為0的 製程
      for (let index = 0; index < this.singlePartYrDataCache.length - 1; index++) {
        const data = this.singlePartYrDataCache[index];
        if (data.input === 0 || data.output === 0) {
          flag = true;
          break;
        }
      }
      if (flag) {
        this.messageService.MessageCode.isFullConfirm.param.nzTitle = this.keyinNotice;
      } else {
        this.messageService.MessageCode.isFullConfirm.param.nzTitle = this.saveNotice;
      }
      this.messageService.MessageCode.isFullConfirm.param.nzOnOk = () => {
        this.keyinLoading = true;
        this.manufaturerInputService
          .saveInputData(this.singlePartYrDataCache)
          .subscribe(
            r => {
              this.keyinLoading = false;
              this.messageService.showMessage(
                this.messageService.MessageCode.fullConfirmSuccess
              );
              this.singlePartYrData = JSON.parse(
                JSON.stringify(this.singlePartYrDataCache)
              );
              this.yieldRateInupt = false;
            },
            e => {
              this.keyinLoading = false;
              this.messageService.showMessage(
                this.messageService.MessageCode.fullConfirmError
              );
            }
          );
      };
      this.messageService.showMessage(
        this.messageService.MessageCode.isFullConfirm
      );
      this.messageService.MessageCode.isFullConfirm.param.nzOnCancel = () => {
        this.checkData = false;
      };
    }
  }

  cancel() {
    this.singlePartYrDataCache = JSON.parse(
      JSON.stringify(this.singlePartYrData)
    );
    this.yieldRateInupt = false;
  }

  // 送出到Top issue
  submit() {
    this.topIssueDate = this.singlePartYrDataCache.filter(f => f.markRed && f.operationName !== 'RTY');
    this.messageService.MessageCode.submitConfirm.param.nzOnOk = () => {
      this.manufaturerInputService
        .submitInputData(
          this.partNumberVendorRecordId,
          this.topIssueDate.length > 0
        )
        .subscribe(
          d => {
            this.messageService.MessageCode.submitSuccess.param.data = d;
            this.messageService.showMessage(
              this.messageService.MessageCode.submitSuccess
            );
            this.vendorRecordStatus = d.vendorRecordStatus;
            if (this.topIssueDate.length > 0) {
              this.page = 2;
            }
          },
          e => {
            this.messageService.MessageCode.submitError.param.data = e;
            this.messageService.showMessage(
              this.messageService.MessageCode.submitError
            );
          }
        );
    };
    this.messageService.MessageCode.submitConfirm.param.data = {
      partNumberVendorRecordId: this.partNumberVendorRecordId,
      topIssueDate: this.topIssueDate
    };
    this.messageService.showMessage(
      this.messageService.MessageCode.submitConfirm
    );
  }

  trClick(data) {
    if (data.operationName !== 'RTY' && data.markRed && !!data.vendorRecordId && this.vendorRecordStatus !== 0) {
      this.page = 2;
      this.topIssueDate = [data];
    }
  }

  // 廠商良率
  pageRouteFn(event) {
    if (event === 1) {
      this.page = event;
    } else {
      this.pageRoute.emit(event);
    }
  }

  download() {
    const table = document.getElementById('singleProcessYrTable');
    this.downExcelService.exportTableAsExcelFile(table, this.excelTitle);
  }

  linkBaseDataParts() {
    const pageData: any = {
      value: {
        manufacturer: this.validateForm.value.manufacturer,
        plant: this.validateForm.value.plant,
        customer: this.validateForm.value.customer,
        projectCode: this.validateForm.value.projectCode,
        projectName: this.validateForm.value.projectName,
        part: this.validateForm.value.part,
        partNumber: this.validateForm.value.partNumber,
        vendor: this.validateForm.value.vendor,
        stage: this.validateForm.value.stage,
        partNumberVendor: this.validateForm.value.partNumberVendor
      },
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

    this.manufaturerInputService.getSubject(pageData);
    this.router.navigate(['/dashboard/mrrMaterial/basedata'], {
      queryParams: {
        rout: 'toSqmBaseDataParts'
      }
    });
  }
}
