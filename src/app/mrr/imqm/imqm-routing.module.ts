import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'real-time-board', pathMatch: 'full' },
  {
    path: 'real-time-board',
    loadChildren: './pages/real-time-board/real-time-board.module#RealTimeBoardModule'
  },
  {
    path: 'manage-board',
    loadChildren: './pages/manage-board/manage-board.module#ManageBoardModule'
  },
  {
    path: 'yr-board',
    loadChildren: './pages/yr-board/yr-board.module#YrBoardModule'
  },
  {
    path: 'trace-board',
    loadChildren: './pages/trace-board/trace-board.module#TraceBoardModule'
  },
  {
    path: 'false-data',
    loadChildren: './pages/false-data/false-data.module#FalseDataModule'
  },
  {
    path: 'warning-board',
    loadChildren: './pages/warning-board/warning-board.module#WarningBoardModule'
  },
  {
    path: 'abnormal-board',
    loadChildren: './pages/abnormal-board/abnormal-board.module#AbnormalBoardModule'
  },
  {
    path: 'download-rawdata',
    loadChildren: './pages/download-rawdata/download-rawdata.module#DownloadRawdataModule'
  },
  {
    path: 'maintain-board',
    loadChildren: './pages/maintain-board/maintain-board.module#MaintainBoardModule'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImqmRoutingModule { }
