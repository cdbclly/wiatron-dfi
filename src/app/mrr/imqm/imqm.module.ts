
import { ImqmRoutingModule } from './imqm-routing.module';
import { CommonModule } from '@angular/common';
import { NgModule, LOCALE_ID, Inject } from '@angular/core';
import { ImqmCommonModule } from './imqm-common/imqm-common.module';
import { SummaryReportComponent } from './pages/snapshotMail/summary-report/summary-report.component';
import { KpiReportComponent } from './pages/snapshotMail/kpi-report/kpi-report.component';
import { FormNosReportComponent } from './pages/snapshotMail/form-nos-report/form-nos-report.component';
import { ReplyReasonComponent } from './pages/reply-reason/reply-reason.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  imports: [
    CommonModule,
    ImqmRoutingModule,
    ImqmCommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  // providers: [
  //   {
  //     provide: LOCALE_ID,
  //     useFactory: LocaleIdFactory
  //   }
  // ],
  declarations: [
    SummaryReportComponent,
    KpiReportComponent,
    FormNosReportComponent,
    ReplyReasonComponent
  ]
})
export class ImqmModule {
  // constructor(private i18n: TranslateService, private i18nSub: I18nService) {
  //   this.i18nSub.transSub.subscribe(lang => {
  //     this.i18n.use(lang.toString());
  //   });
  // }
}
