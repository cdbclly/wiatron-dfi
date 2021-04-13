import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { YrBoardComponent } from './yr-board.component';
import { ImqmCommonModule } from '../../imqm-common/imqm-common.module';
import { YrBoardRoutingModule } from './yr-board-routing.module';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { I18nService } from 'app/shared/i18n.service';

@NgModule({
  imports: [
    TranslateModule,
    CommonModule,
    YrBoardRoutingModule,
    ImqmCommonModule
  ],
  declarations: [
    YrBoardComponent
  ]
})
export class YrBoardModule {
  // constructor(private i18n: TranslateService, private i18nSub: I18nService) {
  //   if (localStorage.getItem('curLang')) {
  //     this.i18n.use(localStorage.getItem('curLang'));
  //   }
  //   this.i18nSub.transSub.subscribe(lang => {
  //     this.i18n.use(lang.toString());
  //     localStorage.setItem('curLang', lang.toString());
  //   });
  // }
 }
