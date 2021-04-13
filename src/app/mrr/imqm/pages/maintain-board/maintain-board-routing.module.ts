import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'test-item',
    loadChildren: './pages/test-item/test-item.module#TestItemModule'
  },
  {
    path: 'system-param',
    loadChildren: './pages/system-param-maintain-board/system-param.module#SystemParamModule'
  },
  {
    path: 'mail-maintain',
    loadChildren: './pages/mail-maintain-board/mail-maintain-board.module#MailMaintainBoardModule'
  },
  {
    path: 'group-auth',
    loadChildren: './pages/group-auth-maintain-board/group-auth.module#GroupAuthModule'
  },
  {
    path: 'user-auth',
    loadChildren: './pages/user-auth-maintain-board/user-auth.module#UserAuthModule'
  },
  {
    path: 'operation-guide',
    loadChildren: './pages/operation-guide/operation-guide.module#OperationGuideModule'
  },
  {
    path: 'filter-data',
    loadChildren: './pages/filter-data-maintain-board/filter-data.module#FilterDataModule'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaintainBoardRoutingModule { }
