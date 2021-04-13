import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SystemParamComponent } from './system-param.component';

const routes: Routes = [
  {
    path: '',
    component: SystemParamComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemParamRoutingModule { }
