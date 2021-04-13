import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { NZ_I18N, zh_CN } from 'ng-zorro-antd';

import { MrrDocRoutingModule } from './mrr-doc-routing.module';
import { MrrDocUploadComponent } from './mrr-doc-upload/mrr-doc-upload.component';
import { MrrDocReportComponent } from './mrr-doc-report/mrr-doc-report.component';
import { MrrDocViewComponent } from './mrr-doc-view/mrr-doc-view.component';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  imports: [
    SharedModule,
    MrrDocRoutingModule,
    TranslateModule
  ],
  declarations: [
    MrrDocUploadComponent,
    MrrDocReportComponent,
    MrrDocViewComponent
  ],
  providers: [
    { provide: NZ_I18N, useValue: zh_CN }
  ]
})
export class MrrDocModule { }
