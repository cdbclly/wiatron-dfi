import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OperationGuideComponent } from './operation-guide.component';

const routes: Routes = [
  {
    path: '',
    component: OperationGuideComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperationGuideRoutingModule { }
