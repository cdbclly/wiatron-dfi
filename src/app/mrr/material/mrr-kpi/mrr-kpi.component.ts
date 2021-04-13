import { toFactoryDefective$ } from './../factory-defective/factory-defective.component';
import { toSqmsIqc$ } from './../sqms-iqc/sqms-iqc.component';
import { toManufaturerInput$ } from './../manufaturer-input/manufaturer-input.component';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject, Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

// 页面跳转
import { ReplaySubject } from 'rxjs';
import { MaterialYieldRateKpi } from 'app/dashboard/mrrboard/material-board/mrrKpi';
import { FactoryRecordApi } from '@service/mrr-sdk';
import { MrrMaterialSelectService } from '../mrr-material-select.service';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
export const getMrrKpiPlantData$ = new ReplaySubject<any>();   // 定义接口
@Component({
  selector: 'app-mrr-kpi',
  templateUrl: './mrr-kpi.component.html',
  styleUrls: ['./mrr-kpi.component.scss']
})
export class MrrKpiComponent implements OnInit {
  validateForm: FormGroup;
  isLoading = false;
  spinLoading = false;
  plants = [];
  plantChange$ = new BehaviorSubject('');
  projectCodes = [];
  projectCode$ = new BehaviorSubject('');
  projectNames = [];
  status = [
    { Value: 1, Label: '未上傳' },
    { Value: 2, Label: '未達標' },
    { Value: 3, Label: '達標' }
  ];
  mrrKpiPlantCharts = [];
  mrrKpiPlantData = [];

  proGoalList = [];
  proGoalFlag = false;
  firstModalFlag = false;
  pnGoalList = [];
  pnGoalFlag = false;
  secondModalFlag = false;
  vendorTargetYield = [];
  iqcTargetYield = [];
  sfcsTargetYield = [];
  vendorTitle: String;
  iqcTitle: String;
  sfcsTitle: String;

  Mathround = Math.round;
  PlantMapping = JSON.parse(localStorage.getItem('DFC_PlantMapping')) || [];
  projectMaterial = [];
  constructor(private fb: FormBuilder,
    private selectService: MrrMaterialSelectService,
    private route: ActivatedRoute,
    private router: Router,
    private factoryRecord: FactoryRecordApi,
    private translate: TranslateService) { }

  async ngOnInit() {
    // 初始化i18n;
    this.translate.get(['mrr.nudd-not-upload', 'mrr.material-fail', 'mrr.material-pass']).subscribe(res => {
      this.status[0].Label = res['mrr.nudd-not-upload'];
      this.status[1].Label = res['mrr.material-fail'];
      this.status[2].Label = res['mrr.material-pass'];
    });
    // 當點擊切換語言
    this.translate.onLangChange.pipe(takeUntil(new Subject())).subscribe(cur => {
      this.translate.get(['mrr.nudd-not-upload', 'mrr.material-fail', 'mrr.material-pass']).subscribe(res => {
        this.status[0].Label = res['mrr.nudd-not-upload'];
        this.status[1].Label = res['mrr.material-fail'];
        this.status[2].Label = res['mrr.material-pass'];
      });
    });
    this.validateForm = this.fb.group({
      plant: [null, [Validators.required]],
      projectCode: [null],
      projectName: [null],
      status: [null]
    });
    this.spinLoading = true;
    if (JSON.stringify(MaterialYieldRateKpi) !== '{}') {
      this.mrrKpiPlantData = MaterialYieldRateKpi;
    } else if (JSON.stringify(MaterialYieldRateKpi) === '{}') {
      this.mrrKpiPlantData = await this.factoryRecord.getPie().toPromise();
    }
    this.initSelect();
    this.route.queryParams.subscribe(d => {
      if (Object.keys(d).length > 0) {
        // 從dashboard進入mrr kpi
        this.validateForm.controls['plant'].setValue(d.plant);
        this.plantChange$.next(d.plant);
        this.query();
      }
      this.spinLoading = false;
    });
  }

  // 初始化下拉框
  initSelect() {
    this.selectService.getPlant().subscribe(res => this.plants = res);
    this.plantChange$.subscribe(plant => {
      this.projectCodes = [];
      this.projectNames = [];
      if (plant) {
        const project = this.mrrKpiPlantData['project'].filter(p => p.Plant === plant);
        for (const i of project) {
          this.projectCodes.push(i.ProjectCode);
          this.projectNames.push(i.ProjectName);
        }
      }
      this.validateForm.controls['projectCode'].setValue('');
      this.validateForm.controls['projectName'].setValue('');
      this.validateForm.controls['status'].setValue('');
    });
    this.projectCode$.subscribe(pro => {
      this.validateForm.controls['projectName'].setValue('');
      if (pro) {
        this.projectNames = [this.mrrKpiPlantData['project'].find(p => p.Plant === this.validateForm.value.plant && p.ProjectCode === pro).ProjectName];
        this.validateForm.controls['projectName'].setValue(this.projectNames[0]);
      }
    });
  }

  // 查詢機種達標清單
  query() {
    this.isLoading = true;
    for (const key in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(key)) {
        this.validateForm.controls[key].markAsDirty();
        this.validateForm.controls[key].updateValueAndValidity();
      }
    }
    if (this.validateForm.value.plant && this.validateForm.value.projectCode && this.validateForm.value.status) {
      this.proGoalList = this.mrrKpiPlantData['project'].filter(m => m.Plant === this.validateForm.value.plant && m.ProjectCode === this.validateForm.value.projectCode && m.status === this.validateForm.value.status);
    } else if (this.validateForm.value.plant && this.validateForm.value.projectCode) {
      this.proGoalList = this.mrrKpiPlantData['project'].filter(m => m.Plant === this.validateForm.value.plant && m.ProjectCode === this.validateForm.value.projectCode);
    } else if (this.validateForm.value.plant && this.validateForm.value.status) {
      this.proGoalList = this.mrrKpiPlantData['project'].filter(m => m.Plant === this.validateForm.value.plant && m.status === this.validateForm.value.status);
    } else if (this.validateForm.value.plant) {
      this.proGoalList = this.mrrKpiPlantData['project'].filter(m => m.Plant === this.validateForm.value.plant);
    }
    this.isLoading = false;
  }

  handleCancel() {
    this.proGoalFlag = false;
  }

  // 點擊機種查看料號的達標情況
  projectGoalList(data) {
    this.pnGoalList = [];
    if (data.flag) {
      const dataSet = this.mrrKpiPlantData['dataSet'][data.Plant][data.ProjectCode];
      for (const key in dataSet) {
        if (Object.prototype.hasOwnProperty.call(dataSet, key)) {
          if (key !== 'pnCount' && key !== 'goal') {
            this.pnGoalList.push({
              plant: data.Plant,
              projectCode: data.ProjectCode,
              projectName: data.ProjectName,
              partNumber: key,
              status: dataSet[key].goal
            });
          }
        }
      }
      this.proGoalFlag = true;
      this.firstModalFlag = true;
    } else {
      this.router.navigate(['/dashboard/mrrMaterial/manufaturer']);
    }
  }

  handleCancel1() {
    this.pnGoalFlag = false;
  }

  // 點擊料號查看具體達標明細
  partNumberGoalList(data) {
    this.vendorTargetYield = this.mrrKpiPlantData['dataSet'][data.plant][data.projectCode][data.partNumber].Vendor;
    this.iqcTargetYield = this.mrrKpiPlantData['dataSet'][data.plant][data.projectCode][data.partNumber].IQC;
    this.sfcsTargetYield = this.mrrKpiPlantData['dataSet'][data.plant][data.projectCode][data.partNumber].SFCS;
    if (data.status === 3) {
      this.vendorTitle = '廠商端達標情況';
      this.iqcTitle = 'IQC端達標情況';
      this.sfcsTitle = '工廠端達標情況';
    } else {
      this.vendorTitle = '廠商端未達標情況';
      this.iqcTitle = 'IQC端未達標情況';
      this.sfcsTitle = '工廠端未達標情況';
    }
    this.pnGoalFlag = true;
    this.secondModalFlag = true;
  }

  // 跳转到相应的页面
  routeLinkManufaturer(data) {
    const toManufaturerInputData: any = {
      select: {
        dateCode: [new Date(data.dateCode), new Date(data.dateCode)],
        partNumbers: [data.partNumber],
        manufacturers: [data.manufacturer],
        plants: [{
          Value: data.plant,
          Label: this.PlantMapping.find(res => data.plant === res['Plant'])['PlantName']
        }],
        customers: [data.customer],
        projectCodes: [data.projectCode],
        parts: [{
          id: data.partId,
          name: data.part,
          productId: data.product
        }],
        stages: [data.stage],
        vendors: [{
          id: data.vendorCode
        }],
        projectNames: [data.projectName],
        partNumberVendor: data.partNumberVendorId
      }
    };
    toManufaturerInput$.next(toManufaturerInputData);
    this.router.navigate(['/dashboard/mrrMaterial/manufaturer'], { queryParams: { manufaturerRoute: 'toManufaturerInput' } });
  }

  routeLinkIqc(data) {
    const year = Number(data.dateCode.substr(0, 4));
    const month = Number(data.dateCode.substr(4, 2)) - 1;
    const day = Number(data.dateCode.substr(6, 2));
    const toIqcData: any = {
      select: {
        dateCode: [new Date(year, month, day), new Date(year, month, day)],
        partNumbers: [data.partNumber],
        manufacturers: [data.manufacturer],
        plants: [{
          Value: data.plant,
          Label: this.PlantMapping.find(res => data.plant === res['Plant'])['PlantName']
        }],
        projectCodes: [data.projectCode],
        parts: [{
          id: data.partId,
          name: data.part,
          productId: data.product
        }],
        stages: [data.stage],
        vendors: [{
          id: data.vendorCode
        }],
        projectNames: [data.projectName],
        partNumberVendor: data.partNumberVendorId
      }
    };
    toSqmsIqc$.next(toIqcData);
    this.router.navigate(['/dashboard/mrrMaterial/iqc'], { queryParams: { iqcRoute: 'toSqmsIqc' } });
  }

  routeLinkDefective(data) {
    const toDefectiveData: any = {
      select: {
        dateCode: [new Date(data.dateCode), new Date(data.dateCode)],
        partNumbers: [data.partNumber],
        manufacturers: [data.manufacturer],
        plants: [{
          Value: data.plantId,
          Label: this.PlantMapping.find(res => data.plantId === res['Plant'])['PlantName']
        }],
        projectCodes: [data.projectCode],
        stages: [data.stage],
        parts: [{
          id: data.partId,
          name: data.part,
          productId: data.product
        }],
        projectNames: [data.projectName]
      }
    };
    toFactoryDefective$.next(toDefectiveData);
    this.router.navigate(['/dashboard/mrrMaterial/defective'], { queryParams: { factoryRoute: 'toFactoryDefective' } });
  }
}
