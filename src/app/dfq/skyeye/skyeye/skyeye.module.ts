import { IssuePipe } from './../pipe/issue.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SkyeyeRoutingModule } from './skyeye-routing.module';
import { SharedModule } from 'app/shared/shared.module';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { MainTainComponent } from './main-tain/main-tain.component';
import { StatusCheckPipe } from '../pipe/status-pipe.pipe';
import { CpkAnalyzeComponent } from '../report/cpk-analyze/cpk-analyze.component';
import { DefecLossAnalyzeComponent } from '../report/defec-loss-analyze/defec-loss-analyze.component';
import { RetryRateAnalyzeComponent } from '../report/retry-rate-analyze/retry-rate-analyze.component';
import { TestTimeAnalyzeComponent } from '../report/test-time-analyze/test-time-analyze.component';
import { TopOptionsComponent } from '../report/shared/top-options/top-options.component';
import { IssueReportComponent } from '../report/issue-report/issue-report.component';
import { PicReportComponent } from '../report/pic-report/pic-report.component';
import { SpecOffsetManagementComponent } from '../report/spec-offset-management/spec-offset-management.component';
import { HistoryAnalyzeReportComponent } from '../report/history-analyze-report/history-analyze-report.component';
import { CpkChartComponent } from '../report/shared/charts/cpk-chart/cpk-chart.component';
import { DefectLossChartComponent } from '../report/shared/charts/defect-loss-chart/defect-loss-chart.component';
import { RetryRateChartComponent } from '../report/shared/charts/retry-rate-chart/retry-rate-chart.component';
import { TestTimeChartComponent } from '../report/shared/charts/test-time-chart/test-time-chart.component';
import { EventPipe } from '../pipe/event.pipe';
import { AteTemperatureReportComponent } from '../report/ate-temperature-report/ate-temperature-report.component';
import { AteTemperatureChartComponent } from '../report/shared/charts/ate-temperature-chart/ate-temperature-chart.component';
import { CntcpkComponent } from '../report/cntcpk/cntcpk.component';
import { YieldAnalyzeComponent } from '../report/yield-analyze/yield-analyze.component';
import { SelectOptionsComponent } from '../report/shared/select-options/select-options.component';
import { YieldRateChartComponent } from '../report/shared/charts/yield-rate-chart/yield-rate-chart.component';
import { FacpkChartComponent } from '../report/shared/charts/facpk-chart/facpk-chart.component';
import { AssemblyDefecChartComponent } from '../report/shared/charts/assembly-defec-chart/assembly-defec-chart.component';
import { AssemblyDefecRateComponent } from '../report/assembly-defec-rate/assembly-defec-rate.component';
import { LightBarFillComponent } from './light-bar-fill/light-bar-fill.component';
import { SpecMemberListComponent } from './spec-member-list/spec-member-list.component';
import { LightBarAnalyzeComponent } from '../report/light-bar-analyze/light-bar-analyze.component';
import { SpcParameterComponent } from './spc-parameter/spc-parameter.component';
import { SpcAnalyzeComponent } from '../report/spc-analyze/spc-analyze.component';
import { WcqlsjAnalyzeComponent } from '../report/wcqlsj-analyze/wcqlsj-analyze.component';
import { WcqlsjMaintainComponent } from './wcqlsj-maintain/wcqlsj-maintain.component';
import { SmartFactoryComponent } from './smart-factory/smart-factory.component';
import { SmartFactoryKanbanComponent } from './smart-factory-kanban/smart-factory-kanban.component';
import { HighSpeedAnalyzeComponent } from '../report/high-speed-analyze/high-speed-analyze.component';
import { TestMaintainComponent } from './test-maintain/test-maintain.component';
import {MatomoModule} from 'ngx-matomo';

@NgModule({
  imports: [
    CommonModule,
    SkyeyeRoutingModule,
    SharedModule,
    MatomoModule
  ],
  declarations: [
    MainLayoutComponent,
    MainTainComponent,
    StatusCheckPipe,
    IssuePipe,
    EventPipe,
    CpkAnalyzeComponent,
    DefecLossAnalyzeComponent,
    RetryRateAnalyzeComponent,
    TestTimeAnalyzeComponent,
    TopOptionsComponent,
    IssueReportComponent,
    PicReportComponent,
    HistoryAnalyzeReportComponent,
    CpkChartComponent,
    DefectLossChartComponent,
    RetryRateChartComponent,
    TestTimeChartComponent,
    AteTemperatureReportComponent,
    AteTemperatureChartComponent,
    CntcpkComponent,
    YieldAnalyzeComponent,
    SelectOptionsComponent,
    YieldRateChartComponent,
    FacpkChartComponent,
    AssemblyDefecChartComponent,
    AssemblyDefecRateComponent,
    LightBarFillComponent,
    LightBarAnalyzeComponent,
    SpecMemberListComponent,
    SpecOffsetManagementComponent,
    SpcParameterComponent,
    SpcAnalyzeComponent,
    WcqlsjAnalyzeComponent,
    WcqlsjMaintainComponent,
    SmartFactoryComponent,
    SmartFactoryKanbanComponent,
    HighSpeedAnalyzeComponent,
    TestMaintainComponent
  ]
})
export class SkyeyeModule {
}
