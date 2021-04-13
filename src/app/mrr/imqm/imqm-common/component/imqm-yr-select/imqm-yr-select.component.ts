import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-imqm-yr-select',
  templateUrl: './imqm-yr-select.component.html',
  styleUrls: ['./imqm-yr-select.component.scss']
})
export class ImqmYrSelectComponent implements OnInit, OnChanges, OnDestroy {

  @Input() radio;
  @Input() period;
  @Output() changeQueryType = new EventEmitter<any>();
  @Output() changePeriod = new EventEmitter<any>();
  radioValue = 'global';
  selectValue = 'vendor';
  periodOption = {
    value: 'day',
    option: [
      {
        value: 'day',
        name: 'Daily'
      },
      {
        value: 'week',
        name: 'Weekly'
      },
      {
        value: 'month',
        name: 'Monthly'
      }
    ]
  };

  // i18n
  destroy$ = new Subject();
  trans: Object = {};

  constructor(
    private translate: TranslateService
  ) {
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(lang => {
      this.translate.get(['imq-global', 'imq-detail', 'imq-supplier', 'imq-model', 'imq-partNumber']).subscribe(res => {
        this.trans['imq-global'] = res['imq-global'];
        this.trans['imq-detail'] = res['imq-detail'];
        this.trans['imq-supplier'] = res['imq-supplier'];
        this.trans['imq-model'] = res['imq-model'];
        this.trans['imq-partNumber'] = res['imq-partNumber'];
      });
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.translate.get(['imq-global', 'imq-detail', 'imq-supplier', 'imq-model', 'imq-partNumber']).subscribe(res => {
      this.trans['imq-global'] = res['imq-global'];
      this.trans['imq-detail'] = res['imq-detail'];
      this.trans['imq-supplier'] = res['imq-supplier'];
      this.trans['imq-model'] = res['imq-model'];
      this.trans['imq-partNumber'] = res['imq-partNumber'];
      if (typeof this.radio !== 'undefined') {
        this.radioValue = this.radio;
      }
      if (typeof this.period !== 'undefined') {
        this.periodOption.value = this.period;
      }
    });
  }

  ngOnInit() {
  }

  onChangeQueryType(value) {
    this.changeQueryType.emit({ radio: this.radioValue, select: this.selectValue });
  }

  onChangePeriod(value) {
    this.periodOption.value = value;
    this.changePeriod.emit(value);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
