import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { SharedModule } from 'app/shared/shared.module';
import { WorkhourMaintainRoutingModule } from './workhour-maintain-routing.module';
import { WorkhourMaintainComponent } from './workhour-maintain.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    WorkhourMaintainRoutingModule,
    TranslateModule
  ],
  declarations: [
    WorkhourMaintainComponent
  ],
  providers: [
    { provide: NZ_I18N, useValue: zh_CN }
  ]
})
export class WorkhourMaintainModule { }
