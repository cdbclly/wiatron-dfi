import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AsidenavbarComponent } from './asidenavbar/asidenavbar.component';
import { TopnavbarComponent } from './topnavbar/topnavbar.component';
import { FooternavbarComponent } from './footernavbar/footernavbar.component';
import { SettingsnavbarComponent } from './settingsnavbar/settingsnavbar.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { TranslateModule } from '@ngx-translate/core';
import { ContactUsComponent } from 'app/layout/contact-us/contact-us.component';
import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { ReportProblemProcessComponent } from './report-problem-process/report-problem-process.component';
import { SharedModule } from 'app/shared/shared.module';
import { MatIconModule, MatMenuModule } from '@angular/material';
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    LayoutRoutingModule,
    NgZorroAntdModule,
    TranslateModule,
    SharedModule,
    MatMenuModule,
    MatIconModule
  ],
  declarations: [
    LayoutComponent,
    AsidenavbarComponent,
    TopnavbarComponent,
    FooternavbarComponent,
    SettingsnavbarComponent,
    ContactUsComponent,
    ReportProblemProcessComponent
  ],
  exports: [
    LayoutComponent,
    TopnavbarComponent,
    AsidenavbarComponent,
    FooternavbarComponent,
    SettingsnavbarComponent
  ]
})
export class LayoutModule {
}
