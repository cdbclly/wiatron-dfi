import { Routes, RouterModule } from '@angular/router';
import { MrrMaterialReportComponent } from './report/mrr-material-report.component';
import { SqmBaseDataComponent } from './sqm-base-data/sqm-base-data.component';
import { ManufaturerInputComponent } from './manufaturer-input/manufaturer-input.component';
import { SqmsIqcComponent } from './sqms-iqc/sqms-iqc.component';
import { FactoryDefectiveComponent } from './factory-defective/factory-defective.component';
import { FactoryDefectiveIssueComponent } from './factory-defective/factory-defective-issue/factory-defective-issue.component';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { NgModule, Injectable } from '@angular/core';
import { ManufaturerInputIssueComponent } from './manufaturer-input/manufaturer-input-issue/manufaturer-input-issue.component';
import { MrrKpiComponent } from './mrr-kpi/mrr-kpi.component';
@Injectable()
export class MRRGuard implements CanActivate {
  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (localStorage.getItem('$DFI$isExt')) {
      this.router.navigateByUrl('/dashboard/mrrMaterial/manufaturer');
      return false;
    } else {
      return true;
    }
  }
}

const routes: Routes = [
  { path: '', component: MrrMaterialReportComponent, canActivate: [MRRGuard] }, // 默认跳转到 Report 页面
  { path: 'basedata', component: SqmBaseDataComponent }, // 跳转到 SQM數據維護管理 页面
  { path: 'manufaturer', component: ManufaturerInputComponent }, // 跳转到 廠商端良率輸入 页面
  { path: 'manufaturer/issue/:id', component: ManufaturerInputIssueComponent }, // 跳转到 廠商端top issue 页面
  { path: 'iqc', component: SqmsIqcComponent, canActivate: [MRRGuard] }, // 跳转到 外驗端檢驗狀態 页面
  { path: 'defective', component: FactoryDefectiveComponent }, // 跳转到 工廠端材料不良查詢 页面
  { path: 'defective/issue', component: FactoryDefectiveIssueComponent }, // 跳转到 工廠端top issue 页面
  { path: 'report', component: MrrMaterialReportComponent, canActivate: [MRRGuard] }, // 跳转到 Report 页面
  { path: 'mrrKpi', component: MrrKpiComponent, canActivate: [MRRGuard] } // 跳转到 材料良率KPI 页面
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [MRRGuard]
})
export class MrrMaterialRoutingModule { }
