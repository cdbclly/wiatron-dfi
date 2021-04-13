import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MrrDocUploadComponent } from './mrr-doc-upload/mrr-doc-upload.component';
import { MrrDocViewComponent } from './mrr-doc-view/mrr-doc-view.component';
import { MrrDocReportComponent } from './mrr-doc-report/mrr-doc-report.component';

const routes: Routes = [
  { path: '', component: MrrDocReportComponent}, // 默认跳转到 MOH参数 维护页面
  { path: 'upload', component: MrrDocUploadComponent}, // 文件資料上傳頁面
  { path: 'upload/:type', component: MrrDocUploadComponent}, // 文件資料上傳頁面 type上傳頁面類型, 暫定為3類  通用currency  外觀appearance 機構mechanism
  { path: 'view', component: MrrDocViewComponent}, // 文件資料查看頁面
  { path: 'report', component: MrrDocReportComponent} // 文件資料上傳頁面
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MrrDocRoutingModule { }
