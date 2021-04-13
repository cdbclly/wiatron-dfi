import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MailMaintainBoardComponent } from './mail-maintain-board.component';
import { ImqmCommonModule } from '../../../../imqm-common/imqm-common.module';
import { MailMaintainBoardRoutingModule } from './mail-maintain-board-routing.module';
import { VendorMaintainComponent } from './vendor-maintain/vendor-maintain.component';
import { WistronMaintainComponent } from './wistron-maintain/wistron-maintain.component';

@NgModule({
  imports: [
    CommonModule,
    ImqmCommonModule,
    MailMaintainBoardRoutingModule
  ],
  declarations: [
    MailMaintainBoardComponent,
    VendorMaintainComponent,
    WistronMaintainComponent
  ]
})
export class MailMaintainBoardModule { }
