import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-dfc',
  templateUrl: './dfc.component.html',
  styleUrls: ['./dfc.component.scss']
})
export class DfcComponent implements OnInit {

  @Output() queryParams = new EventEmitter<any>();
  form = {
    forecastTitle: 'RFQ工時預測',
    trackTitle: '工時追蹤',
    color: 'green',
  };
  transNotice = {};
  constructor(private translate: TranslateService) { }

  ngOnInit() {
    // 初始化i18n;
    this.translate.get(['dashboard.rfqWorkhourForecast', 'dashboard.rfqWorkhourTracking']).subscribe(res => {
      this.form.forecastTitle = res['dashboard.rfqWorkhourForecast'];
      this.form.trackTitle = res['dashboard.rfqWorkhourTracking'];
    });
    // 當點擊切換語言
    this.translate.onLangChange.pipe(takeUntil(new Subject())).subscribe(cur => {
      this.translate.get(['dashboard.rfqWorkhourForecast', 'dashboard.rfqWorkhourTracking']).subscribe(res => {
        this.form.forecastTitle = res['dashboard.rfqWorkhourForecast'];
        this.form.trackTitle = res['dashboard.rfqWorkhourTracking'];
      });
    });
    this.queryParams.emit(this.form);
  }
}
