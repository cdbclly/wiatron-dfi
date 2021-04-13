import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { MainTainComponent } from './main-tain/main-tain.component';
import { CpkAnalyzeComponent } from '../report/cpk-analyze/cpk-analyze.component';
import { DefecLossAnalyzeComponent } from '../report/defec-loss-analyze/defec-loss-analyze.component';
import { RetryRateAnalyzeComponent } from '../report/retry-rate-analyze/retry-rate-analyze.component';
import { TestTimeAnalyzeComponent } from '../report/test-time-analyze/test-time-analyze.component';
import { IssueReportComponent } from '../report/issue-report/issue-report.component';
import { PicReportComponent } from '../report/pic-report/pic-report.component';
import { SpecOffsetManagementComponent } from '../report/spec-offset-management/spec-offset-management.component';
import { SpcAnalyzeComponent } from '../report/spc-analyze/spc-analyze.component';
import { HistoryAnalyzeReportComponent } from '../report/history-analyze-report/history-analyze-report.component';
import { AteTemperatureReportComponent } from '../report/ate-temperature-report/ate-temperature-report.component';
import { CntcpkComponent } from '../report/cntcpk/cntcpk.component';
import { YieldAnalyzeComponent } from '../report/yield-analyze/yield-analyze.component';
import { AssemblyDefecRateComponent } from '../report/assembly-defec-rate/assembly-defec-rate.component';
import { LightBarFillComponent } from './light-bar-fill/light-bar-fill.component';
import { LightBarAnalyzeComponent } from '../report/light-bar-analyze/light-bar-analyze.component';
import { SpecMemberListComponent } from './spec-member-list/spec-member-list.component';
import { SpcParameterComponent } from './spc-parameter/spc-parameter.component';
import { WcqlsjMaintainComponent } from './wcqlsj-maintain/wcqlsj-maintain.component';
import { WcqlsjAnalyzeComponent } from '../report/wcqlsj-analyze/wcqlsj-analyze.component';
import { SmartFactoryComponent } from './smart-factory/smart-factory.component';
import { SmartFactoryKanbanComponent } from './smart-factory-kanban/smart-factory-kanban.component';
import { HighSpeedAnalyzeComponent } from '../report/high-speed-analyze/high-speed-analyze.component';
import { TestMaintainComponent } from './test-maintain/test-maintain.component';


const routes: Routes = [
  {
    path: 'skanban', component: MainLayoutComponent
  },
  {
    path: 'maintain', component: MainTainComponent
  },
  {
    path: 'LightBarFill', component: LightBarFillComponent
  },
  {
    path: 'SpecMemberList', component: SpecMemberListComponent
  },
  {
    path: 'Spcparameter', component: SpcParameterComponent
  },
  {
    path: 'WcqlsjMaintain', component: WcqlsjMaintainComponent
  },
  {
    path: 'report/cpkAnalyze', component: CpkAnalyzeComponent
  },
  {
    path: 'report/cntcpk', component: CntcpkComponent
  },
  {
    path: 'report/yieldAnalyze', component: YieldAnalyzeComponent
  },
  {
    path: 'report/defectLossAnalyze', component: DefecLossAnalyzeComponent
  },
  {
    path: 'report/retryRateAnalyze', component: RetryRateAnalyzeComponent
  },
  {
    path: 'report/assemblyDefecRate', component: AssemblyDefecRateComponent
  },
  {
    path: 'report/testTimeAnalyze', component: TestTimeAnalyzeComponent
  },
  {
    path: 'report/issueReport', component: IssueReportComponent
  }
  ,
  {
    path: 'report/picReport', component: PicReportComponent
  },
  {
    path: 'report/SpecOffsetManagement', component: SpecOffsetManagementComponent
  },
  {
    path: 'report/SpcAnalyze', component: SpcAnalyzeComponent
  },
  {
    path: 'report/WcqlsjAnalyze', component: WcqlsjAnalyzeComponent
  },
  {
    path: 'report/historyReport', component: HistoryAnalyzeReportComponent
  },
  {
    path: 'report/ateTemperatureReport', component: AteTemperatureReportComponent
  },
  {
    path: 'report/lightBarAnalyze' , component: LightBarAnalyzeComponent
  },
  {
    path: 'SmartFactory', component: SmartFactoryComponent
  },
  {
    path: 'SmartFactoryKanban', component: SmartFactoryKanbanComponent
  },
  {
    path: 'report/highSpeedAnalyze', component: HighSpeedAnalyzeComponent
  },
  {
    path: 'testMaintain', component: TestMaintainComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SkyeyeRoutingModule { }
