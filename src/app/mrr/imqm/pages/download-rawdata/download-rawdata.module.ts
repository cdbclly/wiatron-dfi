import { ImqmCommonModule } from './../../imqm-common/imqm-common.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DownloadRawdataRoutingModule } from './download-rawdata-routing.module';
import { DownloadRawdataComponent } from './download-rawdata.component';

@NgModule({
  imports: [
    CommonModule,
    DownloadRawdataRoutingModule,
    ImqmCommonModule
  ],
  declarations: [DownloadRawdataComponent]
})
export class DownloadRawdataModule { }
