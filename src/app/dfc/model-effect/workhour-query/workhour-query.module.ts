import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared/shared.module';
import { WorkhourQueryRoutingModule } from './workhour-query-routing.module';
import { NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { WorkhourQueryComponent } from './workhour-query.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    WorkhourQueryRoutingModule,
    TranslateModule
  ],
  declarations: [
    WorkhourQueryComponent
  ],
  providers: [
    { provide: NZ_I18N, useValue: zh_CN }
  ]
})
export class WorkhourQueryModule { }
