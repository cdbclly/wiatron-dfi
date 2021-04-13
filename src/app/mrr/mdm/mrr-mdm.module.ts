import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { MrrMdmRoutingModule } from './mrr-mdm-routing.module';
import { FileMaintainComponent } from './file-maintain/file-maintain.component';
import { SqmMaintainComponent } from './sqm-maintain/sqm-maintain.component';
import { FileMaintainFileComponent } from './file-maintain/file-maintain-file/file-maintain-file.component';
import { FileMaintainBypassComponent } from './file-maintain/file-maintain-bypass/file-maintain-bypass.component';
import { ManufacturerFilesMaintainComponent } from './sqm-maintain/manufacturer-files-maintain/manufacturer-files-maintain.component';
import { ManufacturerFilesManufacurerFilesComponent } from './sqm-maintain/manufacturer-files-manufacurer-files/manufacturer-files-manufacurer-files.component';
import { CommonModule } from '@angular/common';
import { MufrpieComponent } from './mufrpie/mufrpie.component';
import { DashboardModule } from 'app/dashboard/dashboard.module';
import { MufrpiebyplantComponent } from './mufrpie/mufrpiebyplant/mufrpiebyplant.component';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  imports: [
    SharedModule,
    MrrMdmRoutingModule,
    CommonModule,
    DashboardModule,
    TranslateModule
  ],
  declarations: [
    FileMaintainComponent,
    SqmMaintainComponent,
    FileMaintainFileComponent,
    FileMaintainBypassComponent,
    ManufacturerFilesMaintainComponent,
    ManufacturerFilesManufacurerFilesComponent,
    MufrpieComponent,
    MufrpiebyplantComponent
  ]
})
export class MrrMdmModule { }
