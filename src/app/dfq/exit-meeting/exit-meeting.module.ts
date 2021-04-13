import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared/shared.module';
import { ExitMeetingRoutingModule } from './exit-meeting-routing.module';

import { MeetingReviewTestComponent } from './meeting-review-test/meeting-review-test.component';
import { DateLocaleStringPipe } from './meeting-review-test/date-locale-string.pipe';
import { QueryFormComponent } from './meeting-review-test/query-form/query-form.component';
import { NpiItemsTableComponent } from './meeting-review-test/npi-items-table/npi-items-table.component';
import { MeetingReviewSignerComponent } from './meeting-review-test/meeting-review-signer/meeting-review-signer.component';
import { SummaryComponent } from './summary/summary.component';
import { QueryComponent } from './summary/query/query.component';
import { EchartsComponent } from './summary/echarts/echarts.component';
import { ResultComponent } from './summary/result/result.component';
import { ChecklistmodalComponent } from './checklistmodal/checklistmodal.component';
import { SignerHistoryComponent } from './signer-history/signer-history.component';
import { JudgementComponentComponent } from './meeting-review-test/judgement-component/judgement-component.component';
// pipe
import { JudgeStatusPipe } from './judge-status.pipe';
import { JudgeResultPipe } from './judge-result.pipe';
import { JudgeBooleanResultPipe } from './judge-boolean-result.pipe';
import { SigningStatusPipe } from './signing-status.pipe';
import { SignStatusPipe } from './sign-status.pipe';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    HttpClientModule,
    CommonModule,
    ExitMeetingRoutingModule,
    SharedModule,
    TranslateModule
  ],
  declarations: [
    SummaryComponent,
    MeetingReviewTestComponent,
    DateLocaleStringPipe,
    QueryFormComponent,
    NpiItemsTableComponent,
    MeetingReviewSignerComponent,
    QueryComponent,
    EchartsComponent,
    ResultComponent,
    JudgementComponentComponent,
    SignerHistoryComponent,
    ChecklistmodalComponent,
    JudgeStatusPipe,
    JudgeResultPipe,
    JudgeBooleanResultPipe,
    SignStatusPipe,
    SigningStatusPipe,
  ]
})
export class ExitMeetingModule { }
