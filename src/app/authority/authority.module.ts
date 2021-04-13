import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AuthorityRoutingModule } from './authority-routing.module';
import { UserAuthComponent } from './user-auth/user-auth.component';
import { GroupAuthComponent } from './group-auth/group-auth.component';
import { MemberAuthComponent } from './member-auth/member-auth.component';
import { MrrDocAuthComponent } from './mrr-doc-auth/mrr-doc-auth.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    AuthorityRoutingModule,
    SharedModule,
    TranslateModule
  ],
  declarations: [
    UserAuthComponent,
    GroupAuthComponent,
    MemberAuthComponent,
    MrrDocAuthComponent
  ]
})
export class AuthorityModule { }
