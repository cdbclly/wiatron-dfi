import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared/shared.module';
import { NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { WorkhourGapRoutingModule } from './workhour-gap-routing.module';
import { WorkhourGapComponent } from './workhour-gap.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    WorkhourGapRoutingModule,
    TranslateModule
  ],
  declarations: [
    WorkhourGapComponent
  ],
  providers: [
    { provide: NZ_I18N, useValue: zh_CN }
  ]
})
export class WorkhourGapModule { }
