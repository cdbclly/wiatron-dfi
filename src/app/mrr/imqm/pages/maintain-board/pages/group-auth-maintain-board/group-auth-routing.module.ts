import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GroupAuthComponent } from './group-auth.component';

const routes: Routes = [
  {
    path: '',
    component: GroupAuthComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupAuthRoutingModule { }
