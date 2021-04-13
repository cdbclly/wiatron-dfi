import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PcScheduleComponent } from './pc-schedule/pc-schedule.component';
import { YrTrackingComponent } from './yr-tracking/yr-tracking.component';
import { ModelFpyrListComponent } from './yr-tracking/model-fpyr-list/model-fpyr-list.component';
import { YrTrackingService } from './yr-tracking/yr-tracking.service';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'pc-schedule', 
        component: PcScheduleComponent, 
        resolve: {
          getPlant: 'plantResolve',
          getMdelFamilies: 'mfResolve',
          getModels: 'modelsResolve',
        }
      },
      {
        path: 'pc-schedule:routerParams', 
        component: PcScheduleComponent, 
        resolve: {
          getPlant: 'plantResolve',
          getMdelFamilies: 'mfResolve',
          getModels: 'modelsResolve',
        }
      },
      {
        path: 'yr-tracking:params', 
        component: YrTrackingComponent, 
        resolve: {
          getPlant: 'plantResolve',
          getMdelFamilies: 'mfResolve',
          getModels: 'modelsResolve',
        }
      },
      {
        path: 'yr-tracking', 
        component: YrTrackingComponent, 
        resolve: {
          getPlant: 'plantResolve',
          getMdelFamilies: 'mfResolve',
          getModels: 'modelsResolve',
        }
      },
      {
        path: 'model-fpyr-list', 
        component: ModelFpyrListComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    {
      provide: 'plantResolve',
      useFactory: (service: YrTrackingService) => () => service.getPlants(),
      deps: [YrTrackingService]
    },
    {
      provide: 'mfResolve',
      useFactory: (service: YrTrackingService) => () => service.getModelFamilies(),
      deps: [YrTrackingService]
    },
    {
      provide: 'modelsResolve',
      useFactory: (service: YrTrackingService) => () => service.getModels(),
      deps: [YrTrackingService]
    },
  ]
})
export class MpRoutingModule { }
