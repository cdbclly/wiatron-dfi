import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardModule } from '../dashboard/dashboard.module';
import { ReportRoutingModule } from './report-routing.module';
import { MeetingMinutesComponent } from './meeting-minutes/meeting-minutes.component';
import { DfcComponent } from './dfi-floor-execution/dfc/dfc.component';
import { MrrComponent } from './dfi-floor-execution/mrr/mrr.component';
import { DfqComponent } from './dfi-floor-execution/dfq/dfq.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { SharedModule } from 'app/shared/shared.module';
import { IssueComponent } from './dfi-floor-execution/issue/issue.component';
import { UserEnnamePipe } from 'app/shared/pipe/user-enname/user-enname.pipe';
import { BenefitComponent } from './dfi-benefit/benefit.component';
import { ProjectSummaryComponent } from './project-summary/project-summary.component';
import { ProjectStatusComponent } from './project-status/project-status.component';
import { CanDeactivateGuard } from './router-guard/can-deactivate.guard';
import { StatusNamePipe } from './dfi-floor-execution/issue/status-name.pipe';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    ReportRoutingModule,
    NgZorroAntdModule,
    SharedModule,
    DashboardModule,
    TranslateModule
  ],
  declarations: [
    MeetingMinutesComponent,
    DfcComponent,
    MrrComponent,
    DfqComponent,
    IssueComponent,
    BenefitComponent,
    ProjectSummaryComponent,
    ProjectStatusComponent,
    StatusNamePipe
  ],
  providers: [
    UserEnnamePipe,
    CanDeactivateGuard
  ]
})
export class ReportModule { }
