import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { MachineModelComponent } from './machine-model.component';

const routes: Routes = [
  {
    path: '',
    component: MachineModelComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MachineModelRoutingModule { }
