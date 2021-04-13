import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MeetingMinutesComponent } from './meeting-minutes/meeting-minutes.component';
import { DfcComponent } from './dfi-floor-execution/dfc/dfc.component';
import { DfqComponent } from './dfi-floor-execution/dfq/dfq.component';
import { MrrComponent } from './dfi-floor-execution/mrr/mrr.component';
import { IssueComponent } from './dfi-floor-execution/issue/issue.component';
import { BenefitComponent } from './dfi-benefit/benefit.component';
import { ProjectSummaryComponent } from './project-summary/project-summary.component';
import { ProjectStatusComponent } from './project-status/project-status.component';
import { CanDeactivateGuard } from './router-guard/can-deactivate.guard';

const routes: Routes = [
  { path: 'meeting-minutes', component: MeetingMinutesComponent, canDeactivate: [CanDeactivateGuard] }, // 跳转到 Meeting minutes 页面
  { path: 'project-summary', component: ProjectSummaryComponent }, // 跳转到 Digital Platform Summary 页面
  { path: 'project-status', component: ProjectStatusComponent }, // 跳转到 DFi New Project Status 页面
  { path: 'benefit', component: BenefitComponent }, // 跳转到 WT DFi 效益 页面
  { path: 'dfc-execution', component: DfcComponent }, // 跳转到 DFC 各Site落地執行 页面
  { path: 'dfq-execution', component: DfqComponent }, // 跳转到 DFQ 各Site落地執行 页面
  { path: 'mrr-execution', component: MrrComponent }, // 跳转到 MRR 各Site落地執行 页面
  { path: 'issue', component: IssueComponent }, // 跳转到 MRR 各Site落地執行 页面
  { path: 'issue/:systemName', component: IssueComponent }, // 跳转到 MRR 各Site落地執行 页面
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
