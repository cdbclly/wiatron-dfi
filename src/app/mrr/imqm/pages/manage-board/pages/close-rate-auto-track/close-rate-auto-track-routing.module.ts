import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CloseRateAutoTrackComponent } from './close-rate-auto-track.component';
import { AutoTrackDetailComponent } from './auto-track-detail/auto-track-detail.component';

const routes: Routes = [
  {
    path: '',component: CloseRateAutoTrackComponent
  },
  {
    path: 'trackDetail',component: AutoTrackDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CloseRateAutoTrackRoutingModule { }
