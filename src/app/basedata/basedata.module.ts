import { SharedModule } from 'app/shared/shared.module';
import { SignMaintainComponent } from './sign-maintain/sign-maintain.component';
import { FormMaintainComponent } from './form-maintain/form-maintain.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BasedataRoutingModule } from './basedata-routing.module';
import { ProductTypeMappingComponent } from './product-type-mapping/product-type-mapping.component';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    BasedataRoutingModule,
    TranslateModule
  ],
  declarations: [
    SignMaintainComponent,
    FormMaintainComponent,
    ProductTypeMappingComponent]
})
export class BasedataModule { }
