import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-moh-parameter',
  templateUrl: './moh-parameter.component.html',
  styleUrls: ['./moh-parameter.component.scss']
})
export class MohParameterComponent implements OnInit, OnDestroy {

  selectedIndex = 0;

  @ViewChild('DFCMohParam') dfcMohParam: ElementRef;
  dfcMohParamHeight;

  routeModel;

  // I18N
  title1 = '廠別';
  title2 = '機種';
  destroy$ = new Subject();
  trans: Object = {};
  constructor(
    private route: ActivatedRoute,
    private translate: TranslateService) {
    // 初始化I18N
    this.translate.get(['dfc.dfc-site', 'dfc.dfc-model']).subscribe(res => {
      this.title1 = res['dfc.dfc-site'];
      this.title2 = res['dfc.dfc-model'];
    });
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(cur => {
      this.translate.get(['dfc.dfc-site', 'dfc.dfc-model']).subscribe(res => {
        this.title1 = res['dfc.dfc-site'];
        this.title2 = res['dfc.dfc-model'];
      });
    });
  }

  ngOnInit() {
    this.dfcMohParamHeight = (this.dfcMohParam.nativeElement.offsetHeight - 130) + 'px';
    this.route.params.subscribe(r => {
      if (!r.projectCode || !r.projectName) {
        return;
      }
      this.selectedIndex = 1;
      this.routeModel = {
        projectCode: r.projectCode,
        projectName: r.projectName
      };
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
