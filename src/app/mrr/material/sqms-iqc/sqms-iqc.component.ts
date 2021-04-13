import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { MrrMaterialSelectService } from '../mrr-material-select.service';
import { SqmsIqcService } from './sqms-iqc.service';
import { toManufaturerInputKeyin$ } from '../manufaturer-input/manufaturer-input.component';
import { MrrMaterialMessageService } from '../mrr-material-message.service';
import { ManufaturerInputService } from '../manufaturer-input/manufaturer-input.service';
import { FileService } from './../../../service/file.service';
import { debounceTime } from 'rxjs/operators';
// DFI SDK
import { LoopBackConfig as DFILoopBackConfig } from '@service/dfi-sdk';

export const toSqmsIqc$ = new ReplaySubject<any>();
@Component({
  selector: 'app-sqms-iqc',
  templateUrl: './sqms-iqc.component.html',
  styleUrls: ['./sqms-iqc.component.scss']
})
export class SqmsIqcComponent implements OnInit {
  validateForm: FormGroup;
  isLoading = false;
  // 下拉框的相關設定
  // 查詢條件
  manufacturers = [];
  plants = [];
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
  SQMsData = [];
  queryManufacturer;
  manufacturerVisible = false;
  manufacturerData = [];
  weekNum;
  nowDate;
  vendorRecordStatus;
  partNumberVendorRecordId;
  hasQueried = false;
  manuIssueFlag = false;
  topIssueData = [];
  pageData: any;
  apiURL = DFILoopBackConfig.getPath().toString() +
    '/api/Containers/mrrManuIssuePic/download/';
  showPicture = false;
  showPicSrc = '';
  Mathround = Math.round;
  isExt = localStorage.getItem('$DFI$isExt') ? true : false;
  partNumberVendors;
  plantProject;
  constructor(
    private fb: FormBuilder,
    private selectService: MrrMaterialSelectService,
    private messageService: MrrMaterialMessageService,
    private sqmsIqcService: SqmsIqcService,
    private router: Router,
    private manufaturerInputService: ManufaturerInputService,
    private fileService: FileService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      partNumber: [null, [Validators.required]],
      manufacturer: [null, [Validators.required]],
      plant: [null, [Validators.required]],
      projectCode: [null, [Validators.required]],
      projectName: [null],
      part: [null],
      stage: [null, [Validators.required]],
      vendor: [null, [Validators.required]],
      rangePicker: [null, [Validators.required]],
      partNumberVendor: [null]
    });
    this.initSelect();
    this.route.queryParams.subscribe(param => {
      toSqmsIqc$.subscribe(sqmsIqcData => {
        if (param['iqcRoute']) {
          this.setPageData(sqmsIqcData);
        }
      });
    });
  }

  // mrr-kpi跳转的data处理
  setPageData(sqmsIqcData) {
    this.partNumbers = sqmsIqcData.select.partNumbers;
    this.manufacturers = sqmsIqcData.select.manufacturers;
    this.plants = sqmsIqcData.select.plants;
    this.projectCodes = sqmsIqcData.select.projectCodes;
    this.projectNames = sqmsIqcData.select.projectNames;
    this.parts = sqmsIqcData.select.parts;
    this.stages = sqmsIqcData.select.stages;
    this.vendors = sqmsIqcData.select.vendors;
    this.validateForm.controls['partNumber'].setValue(sqmsIqcData.select.partNumbers[0]);
    this.validateForm.controls['manufacturer'].setValue(sqmsIqcData.select.manufacturers[0]);
    this.validateForm.controls['plant'].setValue(sqmsIqcData.select.plants[0].Value);
    this.validateForm.controls['projectCode'].setValue(sqmsIqcData.select.projectCodes[0]);
    this.validateForm.controls['projectName'].setValue(sqmsIqcData.select.projectNames[0]);
    this.validateForm.controls['part'].setValue(sqmsIqcData.select.parts[0].id);
    this.validateForm.controls['stage'].setValue(sqmsIqcData.select.stages[0]);
    this.validateForm.controls['vendor'].setValue(sqmsIqcData.select.vendors[0].id);
    this.validateForm.controls['rangePicker'].setValue(sqmsIqcData.select.dateCode);
    this.validateForm.controls['partNumberVendor'].setValue(sqmsIqcData.select.partNumberVendor);
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
        this.clearSelect('partNumber');
        this.manufacturers = this.manufacturerInfo['manufacturer'];
        this.validateForm.controls['manufacturer'].setValue(partNumberVendor.find(p => p.partNumberId === PN).manufacturerId);
      }
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
        this.selectService
          .getProNameProCode('material', p, null)
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
      }
      this.clearSelect('plant');
    });
    this.projectCodeChange$.subscribe(proCode => {
      this.clearSelect('projectCode');
      if (proCode) {
        const projectName = this.plantProject.find(p => p.projectCode === proCode).projectName;
        if (!!projectName) {
          this.validateForm.controls['projectName'].setValue(projectName);
        }
        this.parts = this.manufacturerInfo.projectCodeMap[proCode];
        this.validateForm.controls['part'].setValue(this.parts[0].id);
        this.selectService.getStage(proCode).subscribe(v => this.stages = v);
      }
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
    this.sqmsIqcService.query(this.validateForm, this.parts).subscribe(
      d => {
        this.SQMsData = d.filter(item => !item['error']);
        this.queryManufacturer = this.validateForm.value.manufacturer;
        this.isLoading = false;
      },
      error => {
        this.isLoading = false;
        this.messageService.MessageCode.queryError.param.data = error;
        this.messageService.MessageCode.queryError.param.nzTitle =
          'Query failed！';
        this.messageService.showMessage(
          this.messageService.MessageCode.queryError
        );
        toSqmsIqc$.next('');
      }
    );
  }

  // 彈出框
  showManufaturerInput(data) {
    this.manufacturerData = [];
    this.weekNum = this.manufaturerInputService.calWeek(data.dateCode);
    this.nowDate = new Date(data.dateCode);
    this.vendorRecordStatus = data['vendorRecordStatus'];
    if (
      data['manufaturerKeyinDataSet'] &&
      data['manufaturerKeyinDataSet'].length
    ) {
      this.manufacturerData = data['manufaturerKeyinDataSet'];
      this.hasQueried = true;
      this.manufacturerVisible = true;
    } else {
      this.manufacturerData = [];
      this.manufacturerVisible = true;
    }

    this.pageData = {
      value: {
        manufacturer: this.validateForm.value.manufacturer,
        plant: this.validateForm.value.plant,
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
        projectCodes: this.projectCodes,
        projectNames: this.projectNames,
        stages: this.stages,
        parts: this.parts,
        partNumbers: this.partNumbers,
        vendors: this.vendors
      }
    };
    if (data.dateCode) {
      this.pageData.dateCode = new Date(data.dateCode).toLocaleDateString();
    }
    if (data.manufaturerKeyinDataSet) {
      this.pageData.dataSet = data.manufaturerKeyinDataSet;
    }
    if (data.vendorRecordStatus || data.vendorRecordStatus === 0) {
      this.pageData.vendorRecordStatus = data.vendorRecordStatus;
    }
    if (data.partNumberVendorRecordId || data.partNumberVendorRecordId === 0) {
      this.pageData.partNumberVendorRecordId = data.partNumberVendorRecordId;
    }
  }

  handleCancel() {
    this.manufacturerVisible = false;
    this.manuIssueFlag = false;
  }

  trClick(data) {
    this.topIssueData = [];
    if (data.markRed && data.vendorRecordId && this.vendorRecordStatus !== 0) {
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
        this.manuIssueFlag = true;
      });
    }
  }

  goBack() {
    this.manuIssueFlag = false;
  }

  showIssuePicture(filePath) {
    this.showPicSrc = filePath;
    this.showPicture = true;
  }

  // 下載上傳的Excel、PPT以及PDF等
  downIssueDoc(fileName) {
    this.fileService.downloadMRRFile('mrrManuIssuePic', fileName);
  }

  // 跳轉至機種料號維護
  linkBaseDataParts() {
    this.manufaturerInputService.getSubject(this.pageData);
    this.router.navigate(['/dashboard/mrrMaterial/basedata'], {
      queryParams: {
        rout: 'toSqmBaseDataParts'
      }
    });
  }

  // 重新加載
  reQuery() {
    this.nowDate = new Date(this.nowDate);
    const year = this.nowDate.getFullYear();
    const month = this.nowDate.getMonth();
    const day = this.nowDate.getDate();
    this.manufaturerInputService
      .queryKeyin(this.validateForm, [
        this.nowDate.toLocaleDateString(),
        new Date(year, month, day + 1).toLocaleDateString()
      ])
      .subscribe(
        d => {
          this.vendorRecordStatus = d.vendorRecordStatus;
          this.partNumberVendorRecordId = d.partNumberVendorRecordId;
          this.manufacturerData = d.dataSet;
          this.hasQueried = true;
        },
        e => {
          this.messageService.MessageCode.queryError.param.data = e;
          this.messageService.MessageCode.queryError.param.nzTitle =
            'Query failed！';
          this.messageService.showMessage(
            this.messageService.MessageCode.queryError
          );
        }
      );
  }

  // Action 跳轉至廠商良率輸入頁面
  toManufaturerInput(data) {
    const pageData: any = {
      validateForm: this.validateForm,
      select: {
        manufacturers: this.manufacturers,
        plants: this.plants,
        projectCodes: this.projectCodes,
        projectNames: this.projectNames,
        stages: this.stages,
        parts: this.parts,
        partNumbers: this.partNumbers,
        vendors: this.vendors
      }
    };
    if (data.dateCode) {
      pageData.dateCode = new Date(data.dateCode).toLocaleDateString();
    }
    if (data.manufaturerKeyinDataSet) {
      pageData.dataSet = data.manufaturerKeyinDataSet;
    }
    if (data.vendorRecordStatus || data.vendorRecordStatus === 0) {
      pageData.vendorRecordStatus = data.vendorRecordStatus;
    }
    if (data.partNumberVendorRecordId || data.partNumberVendorRecordId === 0) {
      pageData.partNumberVendorRecordId = data.partNumberVendorRecordId;
    }
    toManufaturerInputKeyin$.next(pageData);
    this.router.navigate(['/dashboard/mrrMaterial/manufaturer'], {
      queryParams: {
        rout: 'toManufaturerInputKeyin'
      }
    });
  }
}
