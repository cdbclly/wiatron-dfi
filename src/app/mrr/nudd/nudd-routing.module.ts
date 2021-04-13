import { ReportQueryComponent } from './report/report-query/report-query.component';
import { CriterionMaintainComponent } from './maintain/criterion-maintain/criterion-maintain.component';
import { PictureanalysereportComponent } from './analyse/pictureanalysereport/pictureanalysereport.component';
import { PictureanalyseComponent } from './analyse/pictureanalyse/pictureanalyse.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IdbookanalyseComponent } from './analyse/idbookanalyse/idbookanalyse.component';
import { SigningComponent } from './signing/signing.component';
import { LLUploadComponent } from './maintain/ll-upload/ll-upload.component';
import { PictureUploadComponent } from './maintain/picture-upload/picture-upload.component';
import { NuddUploadComponent } from './maintain/nudd-upload/nudd-upload.component';
import { IdbookMaintainComponent } from './maintain/idbook-maintain/idbook-maintain.component';

const routes: Routes = [
  { path: '', component: IdbookanalyseComponent },
  {
    path: 'idbookanalyse',
    component: IdbookanalyseComponent,
  },
  {
    path: 'pictureanalyse',
    component: PictureanalyseComponent,
  },
  {
    path: 'pictureanalysereport',
    component: PictureanalysereportComponent,
  },
  {
    path: 'report/pictureanalysereport',
    component: PictureanalysereportComponent,
  },
  {
    path: 'nuddsigning',
    component: SigningComponent,
    // resolve: {
    //   bgsResolver: 'BGsResolver',
    //   sitesResolver: 'SitesResolver',
    //   customersResolver: 'CustomersResolver',
    //   stagesResolver: 'StagesResolver'
    // }
  },
  {
    path: 'nuddreport',
    component: ReportQueryComponent
  },
  {
    path: 'crimaintain',
    component: CriterionMaintainComponent
  },
  {
    path: 'idbookmaintain',
    component: IdbookMaintainComponent
  },
  {
    path: 'llupload',
    component: LLUploadComponent
  },
  {
    path: 'pictureupload',
    component: PictureUploadComponent
  },
  {
    path: 'nuddupload',
    component: NuddUploadComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NuddRoutingModule { }
