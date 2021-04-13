
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManufacturerGuard } from 'app/authentication/auth.guard';


const routes: Routes = [
  {
    path: '',
    // canActivate: [ManufacturerGuard],
    children: [
      {
        path: 'mp',
        loadChildren: './mp/mp.module#MpModule'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class DfqRoutingModule { }
