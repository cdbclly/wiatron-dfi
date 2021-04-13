import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MachineModelComponent } from './machine-model.component';
import { MachineModelRoutingModule } from './machine-model-routing.module';
import { ImqmCommonModule } from 'app/mrr/imqm/imqm-common/imqm-common.module';
import { RealTimeBoardModule } from '../../real-time-board.module';

@NgModule({
  imports: [
    CommonModule,
    MachineModelRoutingModule,
    RealTimeBoardModule,
    ImqmCommonModule
  ],
  declarations: [
    MachineModelComponent
  ]
})
export class MachineModelModule { }
