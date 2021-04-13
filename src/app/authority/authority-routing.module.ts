import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserAuthComponent } from './user-auth/user-auth.component';
import { GroupAuthComponent } from './group-auth/group-auth.component';
import { MemberAuthComponent } from './member-auth/member-auth.component';
import { MrrDocAuthComponent } from './mrr-doc-auth/mrr-doc-auth.component';

const routes: Routes = [
  { path: '', component: UserAuthComponent},
  { path: 'user-auth', component: UserAuthComponent},
  { path: 'group-auth', component: GroupAuthComponent},
  { path: 'member-auth', component: MemberAuthComponent},
  { path: 'mrr-doc-auth', component: MrrDocAuthComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthorityRoutingModule { }
