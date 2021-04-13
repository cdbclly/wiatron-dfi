import { FactoryUserRoutingModule } from './factory-user-routing.module';
import { FactoryUserComponent } from './factory-user.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImqmCommonModule } from 'app/mrr/imqm/imqm-common/imqm-common.module';
import { RealTimeBoardModule } from '../../real-time-board.module';

@NgModule({
  imports: [
    CommonModule,
    FactoryUserRoutingModule,
    RealTimeBoardModule,
    ImqmCommonModule
  ],
  declarations: [
    FactoryUserComponent
  ]
})
export class FactoryUserModule { }
