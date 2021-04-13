import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { DfqRoutingModule } from './dfq-routing.module';
import { MpModule } from './mp/mp.module';

@NgModule({
  imports: [
    HttpClientModule,
    SharedModule,
    CommonModule,
    MpModule,
    DfqRoutingModule
  ],
  declarations: []
})
export class DfqModule { }
