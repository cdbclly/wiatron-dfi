// import { MainLayoutComponent } from './dfq/skyeye/skyeye/main-layout/main-layout.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgZorroAntdModule, NZ_I18N, zh_CN, zh_TW } from 'ng-zorro-antd';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { NgxEchartsModule } from 'ngx-echarts';
import { DatePipe } from '@angular/common';
// Service
import { UtilsService } from '../app/service/utils.service';
import { FileService } from './service/file.service';
import { PlantNamePipe } from './shared/pipe/plantName/plant-name.pipe';
import { SDKBrowserModule as DFQSDKBrowserModule } from '../app/service/dfq_sdk/sdk';
import { SDKBrowserModule as DFCSDKBrowserModule } from '../app/service/dfc_sdk/sdk';
import { SDKBrowserModule as IMQMSDKBrowserModule } from '../app/service/imqm-sdk';
import { SDKBrowserModule as PortalBrowserModule } from '../app/service/portal/sdk';
import { SDKBrowserModule as MrrBrowserModule } from '../app/service/mrr-sdk';
import { SDKBrowserModule as DfiBrowserModule } from '../app/service/dfi-sdk';
import { SDKBrowserModule as SkyBrowserModule } from '../app/service/skyeye_sdk';
import { SDKBrowserModule as DpmBrowserModule } from '../app/service/dpm_sdk/sdk';
// component
import { DownexcelService } from '../app/service/downexcel.service';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './../../assets/i18n/', '.json?nocache=' + (new Date()).getTime());
}
import { APP_BASE_HREF } from '@angular/common';
// module
import { LayoutModule } from './layout/layout.module';
import { BasedataModule } from './basedata/basedata.module';
import { SkyeyeModule } from './dfq/skyeye/skyeye/skyeye.module';
import { ImqmModule } from './mrr/imqm/imqm.module';
import { DfqModule } from './dfq/dfq.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ReportModule } from './report/report.module';
import { AuthenticationModule } from './authentication/authentication.module';

registerLocaleData(zh);
@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    BrowserModule,
    FormsModule,
    NgxEchartsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgZorroAntdModule,
    DFQSDKBrowserModule.forRoot(),
    DFCSDKBrowserModule.forRoot(),
    IMQMSDKBrowserModule.forRoot(),
    PortalBrowserModule.forRoot(),
    MrrBrowserModule.forRoot(),
    DfiBrowserModule.forRoot(),
    SkyBrowserModule.forRoot(),
    DpmBrowserModule.forRoot(),
    AuthenticationModule,
    LayoutModule,
    DashboardModule,
    BasedataModule,
    SkyeyeModule,
    ImqmModule,
    ReportModule,
    DfqModule,
    AppRoutingModule
  ],
  providers: [
    { provide: NZ_I18N, useValue: zh_TW },
    PlantNamePipe,
    UtilsService,
    FileService,
    DownexcelService,
    DatePipe,
    { provide: APP_BASE_HREF, useValue: window['_app_base'] || '/' }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
