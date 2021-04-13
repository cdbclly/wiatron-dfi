import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MrrMaterialSelectService } from '../mrr-material-select.service';
import { FactoryDefectiveService } from './factory-defective.service';
import { NzMessageService } from 'ng-zorro-antd';
import { debounceTime } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
export const toFactoryDefective$ = new ReplaySubject<any>(1);
@Component({
  selector: 'app-factory-defective',
  templateUrl: './factory-defective.component.html',
  styleUrls: ['./factory-defective.component.scss']
})
export class FactoryDefectiveComponent implements OnInit {

  validateForm: FormGroup;
  isLoading = false;

  plants = [];
  manufacturers = [];
  projectCodes = [];
  projectNames = [];
  parts = [];
  partNumbers = [];
  partNumberChange$ = new BehaviorSubject('');
  partNumberSearch$ = new BehaviorSubject('');
  manufacturerChange$ = new BehaviorSubject('');
  plantChange$ = new BehaviorSubject('');
  projectCodeChange$ = new BehaviorSubject('');
  projectNameChange$ = new BehaviorSubject('');
  partChange$ = new BehaviorSubject('');
  manufacturerInfo: any = {
    manufacturer: [],
    projectCodeList: [],
    projectCodeMap: {},
    projectNameList: []
  };

  factoryDefectData = [];
  Mathround = Math.round;
  defectIssue;
  page = 0;
  partNumberVendors;
  plantProject;
  isExt = localStorage.getItem('$DFI$isExt') ? true : false;
  constructor(
    private fb: FormBuilder,
    private selectService: MrrMaterialSelectService,
    private factoryDefectiveService: FactoryDefectiveService,
    private message: NzMessageService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      selectPartNumber: [null, [Validators.required]],
      selectManufacturer: [null, [Validators.required]],
      selectPlant: [null, [Validators.required]],
      selectProjectCode: [null, [Validators.required]],
      selectProjectName: [null, [Validators.required]],
      selectPart: [null, [Validators.required]],
      selectStage: [null, [Validators.required]],
      rangePicker: [null, [Validators.required]]
    });
    this.initSelect();
    this.route.queryParams.subscribe(param => {
      toFactoryDefective$.subscribe(factoryDefectiveData => {
        if (param['factoryRoute']) {
          this.setPageData(factoryDefectiveData);
        }
      });
    });
  }

  // mrr-kpi跳转的data处理
  setPageData(factoryDefectiveData) {
    this.partNumbers = factoryDefectiveData.select.partNumbers;
    this.manufacturers = factoryDefectiveData.select.manufacturers;
    this.plants = factoryDefectiveData.select.plants;
    this.projectCodes = factoryDefectiveData.select.projectCodes;
    this.projectNames = factoryDefectiveData.select.projectNames;
    this.parts = factoryDefectiveData.select.parts;
    this.validateForm.controls['selectPartNumber'].setValue(factoryDefectiveData.select.partNumbers[0]);
    this.validateForm.controls['selectManufacturer'].setValue(factoryDefectiveData.select.manufacturers[0]);
    this.validateForm.controls['selectPlant'].setValue(factoryDefectiveData.select.plants[0].Value);
    this.validateForm.controls['selectProjectCode'].setValue(factoryDefectiveData.select.projectCodes[0]);
    this.validateForm.controls['selectProjectName'].setValue(factoryDefectiveData.select.projectNames[0]);
    this.validateForm.controls['selectPart'].setValue(factoryDefectiveData.select.parts[0].id);
    this.validateForm.controls['rangePicker'].setValue(factoryDefectiveData.select.dateCode);
    this.query();
  }

  // 初始化下拉框
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
      }
      this.clearSelect('partNumber');
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
      if (proCode) {
        const plantProject = this.plantProject.filter(p => p.projectCode === proCode);
        if (plantProject.length === 1) {
          this.validateForm.controls['selectProjectName'].setValue(plantProject[0].projectName);
        }
        this.parts = this.manufacturerInfo.projectCodeMap[proCode];
      }
      this.clearSelect('projectCode');
    });
  }

  clearSelect(selectType) {
    switch (selectType) {
      case 'partNumber':
        this.validateForm.controls['selectManufacturer'].setValue('');
      case 'manufacturer':
        this.validateForm.controls['selectPlant'].setValue('');
      case 'plant':
        this.validateForm.controls['selectProjectCode'].setValue('');
        this.validateForm.controls['selectProjectName'].setValue('');
      case 'projectCode':
        this.validateForm.controls['selectPart'].setValue('');
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
    this.factoryDefectiveService.getFactoryData(this.validateForm).subscribe((res: any) => {
      for (let index = 0; index < res.length; index++) {
        res[index].manufacturer = this.validateForm.value.selectManufacturer;
        res[index].part = this.parts.find(
          p => p.id === this.validateForm.value.selectPart
        ).name;
      }
      this.factoryDefectData = res;
      this.factoryDefectData.sort(this.sortByDateCode);
      if (this.factoryDefectData.length < 1) {
        this.message.create('error', 'No data！');
      }
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      this.message.create('error', 'Query failed！');
    });
  }

  // 按DateCode排序
  sortByDateCode(a, b) {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  }

  // 跳轉至top issue
  pageRoute(event) {
    this.page = event;
  }

  toTopIssue(data) {
    if (data.defectQty && data.defectQty > 0) {
      this.defectIssue = data;
      this.page = 1;
    }
  }
}
