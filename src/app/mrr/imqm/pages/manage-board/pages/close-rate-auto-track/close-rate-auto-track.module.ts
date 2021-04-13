import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CloseRateAutoTrackRoutingModule } from './close-rate-auto-track-routing.module';
import { CloseRateAutoTrackComponent } from './close-rate-auto-track.component';
import { ImqmCommonModule } from '../../../../imqm-common/imqm-common.module';
import { AutoTrackSelectComponent } from './auto-track-select/auto-track-select.component';
import { AutoTrackDetailComponent } from './auto-track-detail/auto-track-detail.component';
import { AutoTrackSelectFormsComponent } from './auto-track-select-forms/auto-track-select-forms.component';

@NgModule({
  imports: [
    CommonModule,
    CloseRateAutoTrackRoutingModule,
    ImqmCommonModule
  ],
  declarations: [CloseRateAutoTrackComponent, AutoTrackSelectComponent, AutoTrackDetailComponent, AutoTrackSelectFormsComponent]
})
export class CloseRateAutoTrackModule { }
