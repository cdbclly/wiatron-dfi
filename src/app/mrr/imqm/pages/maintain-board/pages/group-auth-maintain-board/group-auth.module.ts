import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImqmCommonModule } from 'app/mrr/imqm/imqm-common/imqm-common.module';
import { GroupAuthComponent } from './group-auth.component';
import { GroupAuthRoutingModule } from './group-auth-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ImqmCommonModule,
    GroupAuthRoutingModule
  ],
  declarations: [
    GroupAuthComponent
  ]
})
export class GroupAuthModule { }
