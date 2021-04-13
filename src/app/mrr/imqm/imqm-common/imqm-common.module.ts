import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  ImqmSelectComponent,
  ImqmYrSelectComponent,
  MaterialEndProductComponent,
  MaterialAlertProductComponent,
  MaterialPieProductComponent,
  MaterialNgComponent,
  FormsListComponent,
  FormsItemSpcComponent,
  FormsRawDataComponent,
  PopYrComponent,
  PopDrComponent,
  PopAlertComponent,
  PopNgComponent,
  ImqmLineChartComponent,
  FormsVenderThriftListComponent,
  PopVenderThriftComponent,
  PopSpcDetailComponent,
  FormsItemCpkComponent,
  FormsItemComponent,
  FormsItemTraceComponent
} from './component';

import {
  FormsNoCatePipe
} from './pipe/forms-no-cate.pipe';
import { NoDataCheckPipe } from './pipe/no-data-check.pipe';
import { LightStatusPipe } from './pipe/light-status.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { SpcRulePipe } from './pipe/spc-rule.pipe';
import { GroupTransPipe } from './pipe/group-trans.pipe';
import { FormsItemFakeComponent } from './component/imqm-table/forms-item-fake/forms-item-fake.component';
import { ColorPipe } from './pipe/color.pipe';

const IMQMComponent = [
  ImqmSelectComponent,
  ImqmYrSelectComponent,
  MaterialEndProductComponent,
  MaterialAlertProductComponent,
  MaterialPieProductComponent,
  MaterialNgComponent,
  FormsListComponent,
  FormsItemSpcComponent,
  FormsRawDataComponent,
  PopYrComponent,
  PopDrComponent,
  PopAlertComponent,
  PopNgComponent,
  ImqmLineChartComponent,
  FormsVenderThriftListComponent,
  PopVenderThriftComponent,
  PopSpcDetailComponent,
  FormsItemCpkComponent,
  FormsItemComponent,
  FormsItemTraceComponent
];


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxEchartsModule,
    NgZorroAntdModule,
    TranslateModule
  ],
  declarations: [
    IMQMComponent,
    FormsNoCatePipe,
    NoDataCheckPipe,
    LightStatusPipe,
    SpcRulePipe,
    GroupTransPipe,
    FormsItemFakeComponent,
    ColorPipe
  ],
  exports: [
    IMQMComponent,
    FormsNoCatePipe,
    NoDataCheckPipe,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    NgxEchartsModule,
    TranslateModule,
    GroupTransPipe,
    ColorPipe
  ]
})
export class ImqmCommonModule {
 }
