import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkhourMaintainComponent } from './workhour-maintain.component';

const routes: Routes = [
  { path: '', component: WorkhourMaintainComponent },
  { path: ':stageID', component: WorkhourMaintainComponent } // 使用 链接 跳转到 机种工时预测 机种工时资料维护 页面
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkhourMaintainRoutingModule { }
