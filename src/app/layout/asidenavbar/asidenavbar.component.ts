import { GlobalService } from './../../service/skyeye/global.service';
import { Component, OnInit } from '@angular/core';
import { VersionService } from './../../version.service';
import { FileService } from '@service/file.service';

@Component({
  selector: 'app-asidenavbar',
  templateUrl: './asidenavbar.component.html',
  styleUrls: ['./asidenavbar.component.scss']
})
export class AsidenavbarComponent implements OnInit {
  auth;
  // showAuth;
  showDFC;
  showDFCTime;
  showDFCEffect;
  showDFCReport;
  abnormal_num;
  abnormal_type;
  imqmAuth;
  // IMQM Menu
  imqmAccess;
  showVendorRTKanban;
  showModelRTKanban;
  showParMaintain;
  showFalseData;
  showTestItem;
  showMailMaintain;
  showUserMaintain;
  showGroupMaintain;
  showYr;
  showEarlyWarn;
  showAbnormal;
  showTraceBack;
  showSummary;
  showKpi;
  showDownloadData;
  showAutoTrace;
  showOperationGuide;
  showFilterData;
  DFCAdmin = localStorage.getItem('DFC_DFCAdmin');
  temp = localStorage.getItem('$DFI$userID'); // DFC臨時使用，待頁面畫完後刪除
  env = VersionService.env;
  buildTime = VersionService.buildTime;
  isCollapsed = false;
  currentRoute = '';
  isExt = localStorage.getItem('$DFI$isExt') ? true : false;

  constructor(
    private globals: GlobalService,
    private fileService: FileService
  ) {
  }

  ngOnInit() {
    this.globals.AbnormalPot_subject.subscribe((abnormal) => {
      this.abnormal_num = abnormal['num'];
      this.abnormal_type = abnormal['type'];
    });
    this.auth = JSON.parse(localStorage.getItem('$DFI$UserAuth'));
    const a = this.auth;
    if (!this.isExt) {
      this.showDFCTime = a.StandardOperation['access'] || a.ModelOperation['access'] || a.TargetOperation['access']
        || a.StandardOperationSign['access'] || a.TargetOperationSign['access'];
      this.showDFCEffect = a.WorkhourGap['access'] || a.WorkhourQuery['access'] || a.WorkhourReview['access'];
      this.showDFC = a.MOHCondition['access'] || a.MOHAddition['access'] || this.showDFCTime || this.showDFCEffect;
      this.showDFCReport = a.TimeReport['access'] || a.MOHReport['access'] || a.KpiReport['access']
        || a.TargetOperationReport['access'] || a.SummaryReport['access'] || a.ImproveReport['access'];
    }
  }

  getImqmAuth() {
    // set access permissions for the IMQM menu
    if (!this.imqmAuth) {
      this.imqmAuth = JSON.parse(localStorage.getItem('$IMQM$UserRole'));
      this.showVendorRTKanban = this.imqmAuth ? this.imqmAuth['1']['read'] : false;
      this.showModelRTKanban = this.imqmAuth ? this.imqmAuth['3']['read'] : false;
      this.showUserMaintain = this.imqmAuth ? this.imqmAuth['5']['read'] : false;
      this.showGroupMaintain = this.imqmAuth ? this.imqmAuth['6']['read'] : false;
      this.showParMaintain = this.imqmAuth ? this.imqmAuth['7']['read'] : false;
      this.showMailMaintain = this.imqmAuth ? this.imqmAuth['9']['read'] : false;
      this.showYr = this.imqmAuth ? this.imqmAuth['11']['read'] : false;
      this.showEarlyWarn = this.imqmAuth ? this.imqmAuth['13']['read'] : false;
      this.showTraceBack = this.imqmAuth ? this.imqmAuth['15']['read'] : false;
      this.showDownloadData = this.imqmAuth ? this.imqmAuth['28']['read'] : false;
      this.showAbnormal = this.imqmAuth ? this.imqmAuth['16']['read'] : false;
      this.showSummary = this.imqmAuth ? this.imqmAuth['17']['read'] : false;
      this.showKpi = this.imqmAuth ? this.imqmAuth['19']['read'] : false;
      this.showAutoTrace = this.imqmAuth ? this.imqmAuth['21']['read'] : false;
      this.imqmAccess = this.imqmAuth ? true : false;
      this.showOperationGuide = this.imqmAuth ? this.imqmAuth['27']['read'] : false;
      this.showFilterData = this.imqmAuth ? this.imqmAuth['29']['read'] : false;
      this.showTestItem = this.imqmAuth ? this.imqmAuth['30']['read'] : false;
      this.showFalseData = this.imqmAuth ? this.imqmAuth['31']['read'] : false;
    }
  }

  openIMQMPdf_wistron() {
    this.fileService.downloadMRRFile('imqm', '緯創操作指南.pdf');
  }

  openIMQMPdf_vendor() {
    this.fileService.downloadMRRFile('imqm', '廠商操作指南.pdf');
  }
}
