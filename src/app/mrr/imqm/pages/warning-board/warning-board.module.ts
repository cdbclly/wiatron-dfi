import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WarningBoardComponent } from './warning-board.component';
import { ImqmCommonModule } from '../../imqm-common/imqm-common.module';
import { WarningBoardRoutingModule } from './warning-board-routing.module';


@NgModule({
  imports: [
    CommonModule,
    ImqmCommonModule,
    WarningBoardRoutingModule
  ],
  declarations: [
    WarningBoardComponent
  ]
})
export class WarningBoardModule {
  // constructor(private i18n: TranslateService, private i18nSub: I18nService) {
  //   if (localStorage.getItem('curLang')) {
  //     this.i18n.use(localStorage.getItem('curLang'));
  //   }
  //   this.i18nSub.transSub.subscribe(lang => {
  //     debugger
  //     this.i18n.use(lang.toString());
  //     localStorage.setItem('curLang', lang.toString());
  //   });
    // this.i18n.onLangChange.subscribe(lang => {
    //   this.i18n.use(lang.toString());
    // });
  // }
}
