import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared/shared.module';
import { NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { WorkhourValidationRoutingModule } from './workhour-validation-routing.module';
import { WorkhourValidationComponent } from './workhour-validation.component'
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    WorkhourValidationRoutingModule,
    TranslateModule
  ],
  declarations: [
    WorkhourValidationComponent
  ],
  providers: [
    { provide: NZ_I18N, useValue: zh_CN }
  ]
})
export class WorkhourValidationModule {

}
