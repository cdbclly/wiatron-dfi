import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NuddRoutingModule } from './nudd-routing.module';
import { SharedModule } from 'app/shared/shared.module';
import { QueryformComponent } from './analyse/queryform/queryform.component';
import { PictureanalyseComponent } from './analyse/pictureanalyse/pictureanalyse.component';
import { IdbookanalyseComponent } from './analyse/idbookanalyse/idbookanalyse.component';
import { IdresultComponent } from './analyse/idbookanalyse/idresult/idresult.component';
import { PicinputComponent } from './analyse/pictureanalyse/picinput/picinput.component';
import { SigningComponent } from './signing/signing.component';
import { PictureanalysereportComponent } from './analyse/pictureanalysereport/pictureanalysereport.component';
import { CriterionMaintainComponent } from './maintain/criterion-maintain/criterion-maintain.component';
import { PictureUploadComponent } from './maintain/picture-upload/picture-upload.component';
import { LLUploadComponent } from './maintain/ll-upload/ll-upload.component';
import { ReportComponent } from './report/report.component';
import { CriterionQueryComponent } from './maintain/criterion-maintain/criterion-query/criterion-query.component';
import { LlUploadQueryComponent } from './maintain/ll-upload/ll-upload-query/ll-upload-query.component';
import { NuddUploadComponent } from './maintain/nudd-upload/nudd-upload.component';
import { PictureUploadQueryComponent } from './maintain/picture-upload/picture-upload-query/picture-upload-query.component';
import { NuddUploadQueryComponent } from './maintain/nudd-upload/nudd-upload-query/nudd-upload-query.component';
import { RiskLevelPipe } from './risk-level.pipe';
import { ItemdetailsComponent } from './analyse/pictureanalysereport/itemdetails/itemdetails.component';
import { SigningdetailComponent } from './signing/signingdetail/signingdetail.component';
import { SigningqueryformComponent } from './signing/signingqueryform/signingqueryform.component';
import { SignStatusPipe } from './sign-status.pipe';
import { IdbookMaintainComponent } from './maintain/idbook-maintain/idbook-maintain.component';
import { IdbookformComponent } from './maintain/idbook-maintain/idbookform/idbookform.component';
import { MappingmaintainComponent } from './maintain/idbook-maintain/mappingmaintain/mappingmaintain.component';
import { ProcessmaintainComponent } from './maintain/idbook-maintain/processmaintain/processmaintain.component';
import { YrmaintainComponent } from './maintain/idbook-maintain/yrmaintain/yrmaintain.component';
import { SigndetailsComponent } from './analyse/pictureanalysereport/signdetails/signdetails.component';
import { ReportEchartsComponent } from './report/report-echarts/report-echarts.component';
import { ReportQueryComponent } from './report/report-query/report-query.component';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  imports: [
    CommonModule,
    NuddRoutingModule,
    SharedModule,
    TranslateModule
  ],
  declarations:
    [
      PictureanalyseComponent,
      IdbookanalyseComponent,
      IdresultComponent,
      PicinputComponent,
      SigningComponent,
      PictureanalysereportComponent,
      CriterionMaintainComponent,
      PictureUploadComponent,
      LLUploadComponent,
      ReportComponent,
      CriterionQueryComponent,
      QueryformComponent,
      LlUploadQueryComponent,
      NuddUploadComponent,
      PictureUploadQueryComponent,
      NuddUploadQueryComponent,
      RiskLevelPipe,
      ItemdetailsComponent,
      SigningdetailComponent,
      SigningqueryformComponent,
      SignStatusPipe,
      IdbookMaintainComponent,
      IdbookformComponent,
      MappingmaintainComponent,
      ProcessmaintainComponent,
      YrmaintainComponent,
      SigndetailsComponent,
      ReportEchartsComponent,
      ReportQueryComponent
    ]
})
export class NuddModule { }
