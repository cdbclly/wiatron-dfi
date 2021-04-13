import { DfqRewardsPunishmentSignComponent } from './military-order/rewards-punishment-rule-sign/dfq-rewards-punishment-sign/dfq-rewards-punishment-sign.component';
import { RewardsSignDetailComponent } from './military-order/rewards-punishment-rule-sign/rewards-sign-detail/rewards-sign-detail.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MohParameterComponent } from './moh-parameter/moh-parameter.component';
import { MohModelnameComponent } from './moh-modelname/moh-modelname.component';
import { NewmodelMaintainComponent } from './base-data/newmodel-maintain/newmodel-maintain.component';
import { StandartDocumentComponent } from './model-forecast/standart-document/standart-document.component';
import { TargetHoursComponent } from './model-forecast/target-hours/target-hours.component';
import { ModelMohComponent } from './report/model-moh/model-moh.component';
import { ModelWorkhourComponent } from './report/model-workhour/model-workhour.component';
import { DfcKpiComponent } from './report/dfc-kpi/dfc-kpi.component';
import { DfcSummaryComponent } from './report/dfc-summary/dfc-summary.component';
import { TargetReportComponent } from './report/target-report/target-report.component';
import { WorkhourReviewComponent } from './model-effect/workhour-review/workhour-review.component';
import { TargetHourSignComponent } from './model-forecast/target-hour-sign/target-hour-sign.component';
import { MilitaryOrderSignComponent } from './military-order/military-order-sign/military-order-sign.component';
import { WorkhourReportComponent } from './report/workhour-report/workhour-report.component';
import { RewardsPunishmentRuleQueryComponent } from './military-order/rewards-punishment-rule-query/rewards-punishment-rule-query.component';
import { StandartOperationSignComponent } from './model-forecast/standart-operation-sign/standart-operation-sign.component';
import { MilitaryOrderPrintComponent } from './military-order/military-order-sign/military-order-print/military-order-print.component';
import { StandartOperationSignDetailComponent } from './model-forecast/standart-operation-sign/standart-operation-sign-detail/standart-operation-sign-detail.component';
import { TargetHourSignChildComponent } from './model-forecast/target-hour-sign/target-hour-sign-child/target-hour-sign-child.component';
import { WorkReachingComponent } from './report/work-reaching/work-reaching.component';

const routes: Routes = [
  { path: '', component: MohParameterComponent }, // 默认跳转到 MOH参数 维护页面
  { path: 'newmodel-maintain', component: NewmodelMaintainComponent }, // 跳转至 base-data的新机种资料维护页面
  { path: 'newmodel-maintain/:projectCodeID/:projectNameID', component: NewmodelMaintainComponent }, // 使用 链接 跳转至 base-data的新机种资料维护页面
  { path: 'newmodel-maintain/:Plant/:ProjectNameID', component: NewmodelMaintainComponent }, // 使用 链接 跳转至 base-data的新机种资料维护页面
  { path: 'moh-parameter', component: MohParameterComponent }, // 跳转到 MOH参数 维护页面
  { path: 'moh-parameter/:projectCode/:projectName', component: MohParameterComponent }, // 使用 链接 跳转到 MOH参数 维护页面
  { path: 'moh-modelname', component: MohModelnameComponent }, // 跳转到 MOH机种补贴项 维护页面
  { path: 'standart-document', component: StandartDocumentComponent }, // 跳转到 机种工时预测 工时标准维护 页面
  { // 跳转到 机种工时预测 机种工时资料维护 页面
    path: 'workhour-maintain',
    loadChildren: 'app/dfc/model-forecast/workhour-maintain/workhour-maintain.module#WorkhourMaintainModule'
  },
  { path: 'target-hours', component: TargetHoursComponent }, // 跳转到 机种工时预测 目标工时生成 页面
  { path: 'target-hours/:modelID', component: TargetHoursComponent }, // 使用 链接 跳转到 机种工时预测 目标工时生成 页面
  { path: 'target-hours/:stageID/:process', component: TargetHoursComponent },
  { path: 'target-hours/:Plant/:Product/:ProjectNameID', component: TargetHoursComponent },
  { path: 'model-workhour', component: ModelWorkhourComponent }, // 跳转到 Report 机种工时 页面
  { path: 'model-workhour/:plant/:modelType/:id/:type/:stage', component: ModelWorkhourComponent }, // 跳转到 Report 机种工时 页面
  { path: 'model-workhour/:Plant/:Product/:Stage/:ProjectNameID', component: ModelWorkhourComponent },
  { path: 'model-moh', component: ModelMohComponent }, // 跳转到 Report 机种MOH 页面
  { path: 'model-moh/:plant/:projectNameId/:standard', component: ModelMohComponent }, // 跳转到 Report 机种MOH 页面
  { path: 'model-moh/:plant/:modelId/:type/:stage', component: ModelMohComponent }, // 跳转到 Report 机种MOH 页面
  { path: 'model-workhour/:plant/:stage/:type', component: ModelMohComponent }, // 跳转到 Report 机种MOH 页面
  { path: 'dfc-kpi', component: DfcKpiComponent }, // 跳转到 Report KPI 页面
  { path: 'dfc-kpi/:plant/:modelID/:standard', component: DfcKpiComponent }, // 跳转到 Report KPI 页面
  { path: 'dfc-kpi/:plant/:modelID/:stage/:standard', component: DfcKpiComponent }, // 跳转到 Report KPI 页面
  { path: 'dfc-summary', component: DfcSummaryComponent }, // 跳转到 Report Summary 页面
  { path: 'target-report', component: TargetReportComponent }, // 跳转到 Report 目標工時 页面
  { path: 'target-report/:stageID/:process', component: TargetReportComponent }, // 跳转到 Report 目標工時 页面
  { path: 'workhour-review/:stageID/:process', component: WorkhourReviewComponent }, // 跳转到 工時檢討 页面
  { path: 'workhour-review', component: WorkhourReviewComponent }, // 跳转到 工時檢討 页面
  { // 跳转到 工時查询 页面
    path: 'workhour-query',
    loadChildren: 'app/dfc/model-effect/workhour-query/workhour-query.module#WorkhourQueryModule'
  },
  { // 跳转到 工時差異對比 页面
    path: 'workhour-gap',
    loadChildren: 'app/dfc/model-effect/workhour-gap/workhour-gap.module#WorkhourGapModule'
  },
  {
    path: 'workhour-validation',
    loadChildren: 'app/dfc/model-effect/workhour-validation/workhour-validation.module#WorkhourValidationModule'
  },
  {
    path: 'workhour-validation/:stageId',
    loadChildren: 'app/dfc/model-effect/workhour-validation/workhour-validation.module#WorkhourValidationModule'
  },
  { path: 'target-hour-sign', component: TargetHourSignComponent }, // 跳转到 工時查询 页面
  { path: 'target-hour-sign/:plant/:p', component: TargetHourSignComponent },
  { path: 'military-order-sign', component: MilitaryOrderSignComponent }, // 跳转到 工時查询 页面
  { path: 'workhour-report', component: WorkhourReportComponent }, // 跳轉 改善成效report 頁面
  { path: 'workhour-report/:stageID/:process', component: WorkhourReportComponent }, // 跳轉 改善成效report 頁面
  { path: 'military-order', component: MilitaryOrderSignComponent },
  { path: 'military-order/:page', component: MilitaryOrderSignComponent }, // page ==>  query --- 軍令狀查詢, sign --- 軍令狀簽核 页面
  { path: 'military-order/:page/:buPlant', component: MilitaryOrderSignComponent }, // buPlant 軍令狀簽核 页面 所需要的路由信息
  { path: 'military-order-print', component: MilitaryOrderPrintComponent }, // 跳转 军令状 打印 页面
  { path: 'military-order-print/:proNameID/:militaryOrderNo/:signID', component: MilitaryOrderPrintComponent }, // 跳转 军令状 打印 页面
  { path: 'standart-operation-sign', component: StandartOperationSignComponent }, // 跳转 军令状 打印 页面
  { path: 'standart-operation-sign/:modelType/:p', component: StandartOperationSignComponent },
  { path: 'standart-operation-sign-detail', component: StandartOperationSignDetailComponent }, // 跳转 標準工時簽核頁面 页面
  { path: 'rewards-punishment-rule-query', component: RewardsPunishmentRuleQueryComponent }, // 跳轉到獎懲規則查詢頁面
  { path: 'target-hour-sign-detail', component: TargetHourSignChildComponent }, // 跳轉到獎懲規則查詢頁面
  { path: 'rewards-sign-detail', component: RewardsSignDetailComponent },
  { path: 'dfq-rewards-punishment-sign', component: DfqRewardsPunishmentSignComponent },
  { path: 'work-reaching', component: WorkReachingComponent },
  { path: 'work-reaching/:plant', component: WorkReachingComponent }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DfcRoutingModule { }
