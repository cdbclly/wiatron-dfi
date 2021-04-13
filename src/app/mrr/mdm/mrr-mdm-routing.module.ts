import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FileMaintainComponent } from './file-maintain/file-maintain.component';
import { SqmMaintainComponent } from './sqm-maintain/sqm-maintain.component';
import { ManufacturerFilesMaintainComponent } from './sqm-maintain/manufacturer-files-maintain/manufacturer-files-maintain.component';
import { ManufacturerFilesManufacurerFilesComponent } from './sqm-maintain/manufacturer-files-manufacurer-files/manufacturer-files-manufacurer-files.component';
import { MufrpieComponent } from './mufrpie/mufrpie.component';
import { MufrpiebyplantComponent } from './mufrpie/mufrpiebyplant/mufrpiebyplant.component';

const routes: Routes = [
  { path: '', component: FileMaintainComponent}, // 默认跳转到 文件清單 页面
  { path: 'filemaintain', component: FileMaintainComponent}, // 跳转到 文件清單 页面
  { path: 'sqmm', component: SqmMaintainComponent}, // 跳转到 sqm廠商資料維護 页面
  { path: 'sqmfile', component: ManufacturerFilesMaintainComponent}, // 跳转到 sqm廠商文件維護 页面
  { path: 'mumfile/:url', component: ManufacturerFilesManufacurerFilesComponent}, // 跳转到 廠商文件維護 页面
  { path: 'mufrpie', component: MufrpieComponent}, // 跳转到第二层厂商饼图页面
  { path: 'mufrpielist', component: MufrpiebyplantComponent} // 点击第二层饼图跳转到第三层清单列表

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MrrMdmRoutingModule { }
