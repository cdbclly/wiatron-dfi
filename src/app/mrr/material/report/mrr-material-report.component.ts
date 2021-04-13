import { FileService } from './../../../service/file.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MrrMaterialSelectService } from '../mrr-material-select.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { MrrMaterialReportService } from './mrr-material-report.service';
import { MrrMaterialMessageService } from '../mrr-material-message.service';
import { ManufaturerInputService } from '../manufaturer-input/manufaturer-input.service';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { LoopBackConfig as DFILoopBackConfig } from '@service/dfi-sdk';
import { NzMessageService } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-mrr-material-report',
  templateUrl: './mrr-material-report.component.html',
  styleUrls: ['./mrr-material-report.component.scss']
})
export class MrrMaterialReportComponent implements OnInit {
  validateForm: FormGroup;
  isLoading = false;

  // 下拉框的相關設定
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

  materialYrReportData = [];
  badQuantityOption;

  // 彈出框所有參數
  pageData: any;
  manufacturerData = [];
  weekNum;
  nowDate;
  hasQueried = false;
  vendorRecordStatus;
  partNumberVendorRecordId;
  manufacturerVisible = false;
  topIssueData = [];
  manuIssueFlag = false;

  iqcData = [];
  iqcVisible = false;
  queryManufacturer;

  factoryDefectData = [];
  factoryVisible = false;
  factoryTopIssue = [];
  factoryIssueFlag = false;
  inputQty;

  apiURL =
    DFILoopBackConfig.getPath().toString() +
    '/api/Containers/mrrManuIssuePic/download/';
  showPicture = false;
  showPicSrc = '';

  Mathround = Math.round;
  isExt = localStorage.getItem('$DFI$isExt') ? true : false;
  manufacturersCache = [];
  partNumberVendors;
  plantProject;
  queryNotice;
  constructor(
    private fb: FormBuilder,
    private selectService: MrrMaterialSelectService,
    private messageService: MrrMaterialMessageService,
    private mrrMaterialReportService: MrrMaterialReportService,
    private manufaturerInputService: ManufaturerInputService,
    private fileService: FileService,
    private message: NzMessageService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    // 初始化i18n;
    this.translate.get(['mrr.material-report-queryNotice']).subscribe(res => {
      this.queryNotice = res['mrr.material-report-queryNotice'];
    });
    // 當點擊切換語言
    this.translate.onLangChange.pipe(takeUntil(new Subject())).subscribe(cur => {
      this.translate.get(['mrr.material-report-queryNotice']).subscribe(res => {
        this.queryNotice = res['mrr.material-report-queryNotice'];
      });
    });
    this.validateForm = this.fb.group({
      partNumber: [null, [Validators.required]],
      manufacturer: [null],
      plant: [null],
      customer: [null],
      projectCode: [null],
      projectName: [null],
      part: [null],
      stage: [null],
      vendor: [null],
      rangePicker: [[], [Validators.required]],
      partNumberVendor: [null]
    });
    this.initSelect();
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
      } else {
        this.manufacturers = this.manufacturersCache;
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

  // report查詢
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
    if (diffDay > 7) {
      this.message.create('error', this.queryNotice);
      this.isLoading = false;
      return;
    }
    this.mrrMaterialReportService.queryManufacturerReport(this.validateForm).subscribe(d => {
      this.badQuantityOption = d.option;
      this.materialYrReportData = d.dataSet;
      if (this.materialYrReportData.length < 1) {
        this.messageService.MessageCode.queryError.param.nzTitle =
          'No data！';
        this.messageService.showMessage(
          this.messageService.MessageCode.queryError
        );
      }
      this.isLoading = false;
    }, e => {
      this.isLoading = false;
      this.messageService.MessageCode.queryError.param.data = e;
      this.messageService.MessageCode.queryError.param.nzTitle =
        'Query failed！';
      this.messageService.showMessage(
        this.messageService.MessageCode.queryError
      );
    });
  }

  // 工廠端材料不良彈出框
  showFactoryDefect(data) {
    if (!!data.inputQty) {
      this.factoryDefectData = [data];
      this.factoryVisible = true;
    }
  }

  toFactoryTopIssue(data) {
    this.inputQty = data.inputQty;
    this.factoryTopIssue = [];
    this.mrrMaterialReportService.getFactoryIssue(data).subscribe(issue => {
      for (let index = 0; index < issue.length; index++) {
        if (!issue[index]['dueDate']) {
          issue[index]['dueDate'] = new Date(
            new Date().setDate(new Date().getDate() + 4)
          );
        }
        if (!issue[index]['status']) {
          issue[index]['status'] = 0;
        }
        if (issue[index]['filePath']) {
          const docType = ['jpg', 'png', 'gif', 'jpeg', 'bmp'];
          if (
            !docType.includes(
              issue[index]['filePath']
                .split('.')
                .pop()
                .toLowerCase()
            )
          ) {
            // 上傳非圖片格式
            issue[index]['docType'] = false;
          } else {
            issue[index]['docType'] = true;
          }
        }
      }
      this.factoryTopIssue = issue;
      this.factoryTopIssue.sort(this.sortDefectQty);
      this.factoryIssueFlag = true;
    });
  }

  sortDefectQty(a, b) {
    return b.defectQty - a.defectQty;
  }

  goBackFactory() {
    this.factoryIssueFlag = false;
  }

  handleCancel2() {
    this.factoryVisible = false;
    this.factoryIssueFlag = false;
  }

  showIssuePicture(filePath) {
    this.showPicSrc = filePath;
    this.showPicture = true;
  }

  // 下載上傳的Excel、PPT以及PDF等
  downIssueDoc(fileName) {
    this.fileService.downloadMRRFile('mrrManuIssuePic', fileName);
  }

  // VQC彈出框
  showIqc(data) {
    if (!!data.result) {
      this.queryManufacturer = data.manufacturer;
      this.iqcData = [data];
      this.iqcVisible = true;
    }
  }

  handleCancel1() {
    this.iqcVisible = false;
  }

  // 廠商端良率彈出框
  showManufaturerInput(data) {
    this.weekNum = this.manufaturerInputService.calWeek(data.dateCode);
    this.nowDate = new Date(data.dateCode);
    this.manufacturerData = data.dataSet;
    this.manufacturerVisible = true;
  }

  // 點擊跳轉 廠商端Top issue
  trClick(data) {
    this.topIssueData = [];
    if (data.operationName !== 'RTY' && data.markRed && !!data.vendorRecordId && data.vendorRecordStatus !== 0) {
      this.manufaturerInputService.queryTopIssue([data]).subscribe(d => {
        for (let index = 0; index < d.length; index++) {
          if (d[index]['filePath']) {
            const docType = ['jpg', 'png', 'gif', 'jpeg', 'bmp'];
            if (
              !docType.includes(
                d[index]['filePath']
                  .split('.')
                  .pop()
                  .toLowerCase()
              )
            ) {
              // 上傳非圖片格式
              d[index]['docType'] = false;
            } else {
              d[index]['docType'] = true;
            }
          }
        }
        this.topIssueData = d;
        this.topIssueData.sort(this.sortDefectQty);
        this.manuIssueFlag = true;
      });
    }
  }

  goBack() {
    this.manuIssueFlag = false;
  }

  handleCancel() {
    this.manufacturerVisible = false;
    this.manuIssueFlag = false;
  }
}
