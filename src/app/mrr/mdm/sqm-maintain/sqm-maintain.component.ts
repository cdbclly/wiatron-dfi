import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PartNumberVendorFileApi, VendorProductDocumentApi } from '@service/mrr-sdk';
import { View_PartNumberOverviewApi } from '@service/mrr-sdk/services/custom/View_PartNumberOverview';
// MRR SDK
import { LoopBackConfig as NUDDLoopBackConfig } from '@service/mrr-sdk';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-sqm-maintain',
  templateUrl: './sqm-maintain.component.html',
  styleUrls: ['./sqm-maintain.component.scss']
})
export class SqmMaintainComponent implements OnInit {
  validateForm: FormGroup;
  mapOfExpandData: { [key: string]: boolean } = {};
  isSearchLoading = false; // 查詢loading
  ProjectPartNumberList = [];
  plants;  // 下拉框的plant
  projectCodes; // 下拉框projectCode
  allProjectCodeOptions;
  projectNames;  // 下拉框projectName
  allProjectNameOptions;
  formData;
  displayTble1 = false;
  showData;
  nowDate;  // 當前日期
  filterOption = () => true;   // 聲明
  transNotice = {};
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private vendorproductdocument: VendorProductDocumentApi,
    private partNumberVendorFileApi: PartNumberVendorFileApi,
    private view_PartNumberOverviewApi: View_PartNumberOverviewApi,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    // 初始化i18n;
    this.translate.get(['mrr.vendor-sop-name']).subscribe(res => {
      this.transNotice['sopName'] = res['mrr.vendor-sop-name'];
    });
    // 當點擊切換語言
    this.translate.onLangChange.pipe(takeUntil(new Subject())).subscribe(cur => {
      this.translate.get(['mrr.vendor-sop-name']).subscribe(res => {
        this.transNotice['sopName'] = res['mrr.vendor-sop-name'];
      });
    });
    this.validateForm = this.fb.group({
      sitePlant: [null, [Validators.required]],
      projectName: [null, []],
      projectCode: [null, []],
    });
    this.getPlants();
  }

  // 聯動下拉框
  // 廠區下拉框
  getPlants() {
    this.plants = [];
    this.vendorproductdocument.getAllByPlant(null, null, null).subscribe(res => {
      this.view_PartNumberOverviewApi.find().subscribe(ree => {
        if (res) {
          for (const p of res.data[0]['listData']) {
            this.plants.push(p['plant']);   // 廠別下拉框
          }
        }
        if (ree) {
          this.ProjectPartNumberList = ree;     // projectCodes下拉框
        }
      });
    });
  }

  // BYplant
  plantChange(e) {
    this.projectCodes = [];
    this.projectNames = [];
    this.validateForm.controls['projectName'].setValue(null);
    this.validateForm.controls['projectCode'].setValue(null);   // 當第二次去選擇plant時，先清空projectCode
    // projectCode下拉框
    const newProjectPartNumber1 = this.ProjectPartNumberList.filter(a => a.plant === e);
    this.formData = newProjectPartNumber1;
    for (const item1 of newProjectPartNumber1) {
      this.projectCodes.push(item1.projectId);
      this.projectNames.push(item1.projectName);
    }
    // this.projectCodes去重
    for (let i = 0; i < this.projectCodes.length; i++) {
      for (let j = i + 1; j < this.projectCodes.length; j++) {
        if (this.projectCodes[i] === this.projectCodes[j]) {
          this.projectCodes.splice(j, 1);
          j--;
        }
      }
    }
    // this.projectNames去重
    for (let i = 0; i < this.projectNames.length; i++) {
      for (let j = i + 1; j < this.projectNames.length; j++) {
        if (this.projectNames[i] === this.projectNames[j]) {
          this.projectNames.splice(j, 1);
          j--;
        }
      }
    }
    this.allProjectCodeOptions = this.projectCodes;
    this.allProjectNameOptions = this.projectNames;
  }

  // BYprojectName
  projectNameChange(projectName) {
    if (projectName) {
      this.validateForm.controls['projectCode'].setValue(null);
      const projectCodes = [];
      if (projectName[0] === 'All') {
        this.projectNames = this.projectNames.filter(a => a !== 'All');
        this.validateForm.controls['projectName'].setValue(this.projectNames);
      }
      for (let k = 0; k < this.formData.length; k++) {
        if (this.validateForm.value.projectName.includes(this.formData[k].projectName)) {
          projectCodes.push(this.formData[k].projectId);
        }
        if (k === this.formData.length - 1) {
          // projectCodes 去重
          for (let i = 0; i < projectCodes.length; i++) {
            for (let j = i + 1; j < projectCodes.length; j++) {
              if (projectCodes[i] === projectCodes[j]) {
                projectCodes.splice(j, 1);
                j--;
              }
            }
          }
          this.validateForm.controls['projectCode'].setValue(projectCodes);
        }
      }
    }
  }

  // 手動寫select下拉框自己需要的搜索條件
  search(selectValue) {
    const reg = new RegExp(selectValue);
    const arr = [];
    for (let i = 0; i < this.allProjectNameOptions.length; i++) {
      if (reg.test(this.allProjectNameOptions[i])) {
        arr.push(this.allProjectNameOptions[i]);
      }
    }   // 正則表達的模糊查詢
    if (arr.length > 1) {
      arr.unshift('All');
    }
    this.projectNames = arr;
  }

  query() {
    this.showData = [];
    this.isSearchLoading = true;
    let queryData = {};
    if (this.validateForm.value.projectCode && this.validateForm.value.projectCode.length !== 0) {
      queryData = {
        plant: this.validateForm.value.sitePlant,
        projectIdList: this.validateForm.value.projectCode
      };
    } else {
      queryData = {
        plant: this.validateForm.value.sitePlant,
        projectIdList: this.projectCodes
      };
    }
    this.partNumberVendorFileApi.getPartNumberOverview(queryData).subscribe(res => {
      for (let i = 0; i < res.data.length; i++) {
        for (let j = 0; j < res.data[i]['listData'].length; j++) {
          for (let k = 0; k < res.data[i]['listData'][j]['listData'].length; k++) {
            res.data[i]['index'] = i;
            res.data[i]['c3DueDay'] = res.data[i]['c3DueDay'].slice(0, 10); // 截取T前面的日期;
            res.data[i]['c4DueDay'] = res.data[i]['c4DueDay'].slice(0, 10);
            res.data[i]['c5DueDay'] = res.data[i]['c5DueDay'].slice(0, 10);
            // 取兩位小數
            const c3PassRateIndex = res.data[i]['listData'][j]['listData'][k]['c3PassRate'].lastIndexOf('%');
            const c3UploadCompleteRateIndex = res.data[i]['listData'][j]['listData'][k]['c3UploadCompleteRate'].lastIndexOf('%');
            const c4PassRateIndex = res.data[i]['listData'][j]['listData'][k]['c4PassRate'].lastIndexOf('%');
            const c4UploadCompleteRateIndex = res.data[i]['listData'][j]['listData'][k]['c4UploadCompleteRate'].lastIndexOf('%');
            const c5PassRateIndex = res.data[i]['listData'][j]['listData'][k]['c5PassRate'].lastIndexOf('%');
            const c5UploadCompleteRateIndex = res.data[i]['listData'][j]['listData'][k]['c5UploadCompleteRate'].lastIndexOf('%');
            res.data[i]['listData'][j]['listData'][k]['c3PassRate'] = Number(res.data[i]['listData'][j]['listData'][k]['c3PassRate'].substring(0, c3PassRateIndex)).toFixed(2) + '%';
            res.data[i]['listData'][j]['listData'][k]['c3UploadCompleteRate'] = Number(res.data[i]['listData'][j]['listData'][k]['c3UploadCompleteRate'].substring(0, c3UploadCompleteRateIndex)).toFixed(2) + '%';
            res.data[i]['listData'][j]['listData'][k]['c4PassRate'] = Number(res.data[i]['listData'][j]['listData'][k]['c4PassRate'].substring(0, c4PassRateIndex)).toFixed(2) + '%';
            res.data[i]['listData'][j]['listData'][k]['c4UploadCompleteRate'] = Number(res.data[i]['listData'][j]['listData'][k]['c4UploadCompleteRate'].substring(0, c4UploadCompleteRateIndex)).toFixed(2) + '%';
            res.data[i]['listData'][j]['listData'][k]['c5PassRate'] = Number(res.data[i]['listData'][j]['listData'][k]['c5PassRate'].substring(0, c5PassRateIndex)).toFixed(2) + '%';
            res.data[i]['listData'][j]['listData'][k]['c5UploadCompleteRate'] = Number(res.data[i]['listData'][j]['listData'][k]['c5UploadCompleteRate'].substring(0, c5UploadCompleteRateIndex)).toFixed(2) + '%';
          }
        }
      }
      this.showData = res.data;
      this.isSearchLoading = false;
      console.log(this.showData);
    });
  }

  // 跳轉傳參
  goC3FileMaintain(d, m, t) {
    if (t.lastMailSentDate) {
      const dateString = t.lastMailSentDate.toString();
      const date = dateString.match(/(\S*)T/)[1];  // 截取T前面的日期
      const dateTime = dateString.match(/T(\S*):/)[1];  // 截取T後面：前面的時間
      t.lastMailSentDate = `${date} ${dateTime}`;
    }
    this.router.navigate(['/dashboard/mrrMdm/sqmfile'],
      {
        queryParams: {
          plant: this.validateForm.value.sitePlant,
          projectCode: d.projectId,
          stage: 'C3',
          part_no: m.partNumberId,
          manufacturer: t.manufacturerId,
          partNumberVendorId: t.partNumberVendorId,
          uploadCompleteRate: t.c3UploadCompleteRate,
          passRate: t.c3PassRate,
          containerName: t.containerName,
          lastMailSentDate: t.lastMailSentDate
        }
      });
  }

  goC4FileMaintain(d, m, t) {
    if (t.lastMailSentDate) {
      const dateString = t.lastMailSentDate.toString();
      const date = dateString.match(/(\S*)T/)[1];  // 截取T前面的日期
      const dateTime = dateString.match(/T(\S*):/)[1];  // 截取T後面，：前面的時間
      t.lastMailSentDate = `${date} ${dateTime}`;
    }
    this.router.navigate(['/dashboard/mrrMdm/sqmfile'],
      {
        queryParams: {
          plant: this.validateForm.value.sitePlant,
          projectCode: d.projectId,
          stage: 'C4',
          part_no: m.partNumberId,
          manufacturer: t.manufacturerId,
          partNumberVendorId: t.partNumberVendorId,
          uploadCompleteRate: t.c4UploadCompleteRate,
          passRate: t.c4PassRate,
          containerName: t.containerName,
          lastMailSentDate: t.lastMailSentDate
        }
      });
  }

  goC5FileMaintain(d, m, t) {
    if (t.lastMailSentDate) {
      const dateString = t.lastMailSentDate.toString();
      const date = dateString.match(/(\S*)T/)[1];  // 截取T前面的日期
      const dateTime = dateString.match(/T(\S*):/)[1];  // 截取T後面，：前面的時間
      t.lastMailSentDate = `${date} ${dateTime}`;
    }
    this.router.navigate(['/dashboard/mrrMdm/sqmfile'],
      {
        queryParams: {
          plant: this.validateForm.value.sitePlant,
          projectCode: d.projectId,
          stage: 'C5',
          part_no: m.partNumberId,
          manufacturer: t.manufacturerId,
          partNumberVendorId: t.partNumberVendorId,
          uploadCompleteRate: t.c5UploadCompleteRate,
          passRate: t.c5PassRate,
          containerName: t.containerName,
          lastMailSentDate: t.lastMailSentDate
        }
      });
  }

  downSqmSop() {
    const token = localStorage.getItem('$DFI$token').toString();
    const apiURL = NUDDLoopBackConfig.getPath().toString();
    const container = 'mrrDoc';
    const fileUrl = apiURL + `/api/containers/${container}/download/${this.transNotice['sopName']}.pdf`;
    fetch(fileUrl, {
      method: 'GET',
      headers: new Headers({
        'content-Type': 'application/json;charset=UTF-8',
        Authorization: token
      })
    }).then(async res => await res.blob()).then(async (blob) => {
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = URL.createObjectURL(blob);
      a.download = `${this.transNotice['sopName']}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }
}
