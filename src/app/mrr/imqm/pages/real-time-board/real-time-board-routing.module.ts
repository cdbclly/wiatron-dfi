import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FactoryUserService, FactoryUserResolve } from './pages/factory-user/factory-user.service';
import { MachineModelService, MachineModelResolve } from './pages/machine-model/machine-model.service';
import { AccessGuard } from '../../imqm-common/guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/factory-user',
    pathMatch: 'full'
  },
  {
    path: 'factory-user',
    loadChildren: './pages/factory-user/factory-user.module#FactoryUserModule',
    resolve: {
      initData: 'initResolver',
      injectResolve: FactoryUserResolve
    },
    canActivate: [AccessGuard]
  },
  {
    path: 'machine-model',
    loadChildren: './pages/machine-model/machine-model.module#MachineModelModule',
    resolve: {
      initData: 'modelResolver',
      injectResolve: MachineModelResolve
    },
    canActivate: [AccessGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    FactoryUserResolve,
    {
      provide: 'initResolver',
      useFactory: (service: FactoryUserService) => () => service.getInitData(),
      deps: [FactoryUserService]
    },
    MachineModelResolve,
    {
      provide: 'modelResolver',
      useFactory: (service: MachineModelService) => () => service.getInitData(),
      deps: [MachineModelService]
    },
    AccessGuard
  ]
})
export class RealTimeBoardRoutingModule { }
