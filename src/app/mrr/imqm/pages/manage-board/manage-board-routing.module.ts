import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'summary',
    loadChildren: './pages/summary/summary.module#SummaryModule'
  },
  {
    path: 'kpi-board',
    loadChildren: './pages/kpi-board/kpi-board.module#KpiBoardModule'
  },
  {
    path: 'auto-track',
    loadChildren: './pages/close-rate-auto-track/close-rate-auto-track.module#CloseRateAutoTrackModule'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageBoardRoutingModule { }
