import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserAuthRoutingModule } from './user-auth-routing.module';
import { ImqmCommonModule } from 'app/mrr/imqm/imqm-common/imqm-common.module';
import { UserAuthComponent } from './user-auth.component';

@NgModule({
  imports: [
    CommonModule,
    ImqmCommonModule,
    UserAuthRoutingModule
  ],
  declarations: [
    UserAuthComponent
  ]
})
export class UserAuthModule { }
