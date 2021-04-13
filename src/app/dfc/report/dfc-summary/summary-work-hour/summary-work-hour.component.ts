import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DfcSummaryQueryStyle, ClsDfcSummarySelect } from '../dfc-summary';
import { DfcSummaryService } from '../dfc-summary.service';
@Component({
  selector: 'app-summary-work-hour',
  templateUrl: './summary-work-hour.component.html',
  styleUrls: ['./summary-work-hour.component.scss']
})
export class SummaryWorkHourComponent implements OnInit, OnChanges {

  queryStyle = DfcSummaryQueryStyle;
  tablePaging = true;
  @Input() selectValue: ClsDfcSummarySelect;
  @Input() querySelect: any;
  @Input() dataSet: any;
  @Input() processHeaders: string[];
  @Input() queryLoading: boolean;
  @Input() tableHeight;
  @Output() workHourChangePlant = new EventEmitter();
  @Output() workHourChangeCustomAndModelType = new EventEmitter();
  @Output() workHourChangeCFlow = new EventEmitter();
  @Output() workHourCustomSearch = new EventEmitter();
  @Output() workHourChangeProName = new EventEmitter();
  @Output() workHourProCodeSearch = new EventEmitter();
  @Output() workHourProNameSearch = new EventEmitter();
  @Output() workHourModelSearch = new EventEmitter();
  @Output() workHourQuery = new EventEmitter();
  @Output() workHourDownload = new EventEmitter();

  // 展開表格表頭相關
  c2 = { col: 2, expand: false };
  c3 = { col: 2, expand: false };
  c4 = { col: 2, expand: false };
  c5 = { col: 2, expand: false };
  c6 = { col: 2, expand: false };
  expandCount = 0;
  expandArr: any[] = [this.c2, this.c3, this.c4, this.c5, this.c6];
  innerTabelColspan = 25;

  // 表格數據相關
  nzScrollRep: any = { x: '2400px' };
  nzWidthConfig = ['80px', '80px', '90px', '80px', '150px', '120px', '150px', '85px', '100px', '65px', '120px', '110px',
    '100px', '100px', '100px', '100px', '100px', '100px', '100px',
    '100px', '100px', '100px', '100px', '100px'];

  constructor(
    private dfcSummaryService: DfcSummaryService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    // 初始化i18n;
    this.translate.get(['mrr.mrr-plant', 'mrr.mrr-customer', 'mrr.mrr-product', 'report.cur-cstage']).subscribe(res => {
      DfcSummaryQueryStyle.plant.label = res['mrr.mrr-plant'];
      DfcSummaryQueryStyle.custom.label = res['mrr.mrr-customer'];
      DfcSummaryQueryStyle.modelType.label = res['mrr.mrr-product'];
      DfcSummaryQueryStyle.cFlow.label = res['report.cur-cstage'];
    });
    // 當點擊切換語言
    this.translate.onLangChange.pipe(takeUntil(new Subject())).subscribe(cur => {
      this.translate.get(['mrr.mrr-plant', 'mrr.mrr-customer', 'mrr.mrr-product', 'report.cur-cstage']).subscribe(res => {
        DfcSummaryQueryStyle.plant.label = res['mrr.mrr-plant'];
        DfcSummaryQueryStyle.custom.label = res['mrr.mrr-customer'];
        DfcSummaryQueryStyle.modelType.label = res['mrr.mrr-product'];
        DfcSummaryQueryStyle.cFlow.label = res['report.cur-cstage'];
      });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (const key in changes) {
      if (key === 'processHeaders') {
        if (!!changes[key].previousValue) { // processHeaders改變，則表格回復初始狀態
          this.expandArr.forEach(item => {
            item['col'] = 2;
            item['expand'] = false;
          });
          this.nzScrollRep.x = '2400px';
          const nzWidthConfig = ['80px', '80px', '90px', '80px', '120px', '150px', '150px', '85px', '100px', '65px', '120px', '110px',
            '100px', '100px', '100px', '100px', '100px', '100px', '100px',
            '100px', '100px', '100px', '100px', '100px'
          ];
          this.nzWidthConfig = nzWidthConfig;
          this.expandCount = 0;
        }
      } else if (key === 'tableHeight' && changes['tableHeight'].currentValue) {
        this.nzScrollRep['y'] = this.tableHeight + 'px';
      }
    }
  }

  isObjectType(val): boolean {  // 是引用類型為true，基本類型為false
    if ((typeof val) === 'object') {
      return true;
    } else {
      return false;
    }
  }

  // 判斷是否為 前3項，前3項不顯示
  isColIndex(index): boolean {
    if ([0, 1, 2, 3].includes(index)) {
      return false;
    } else {
      return true;
    }
  }

  isInnerType(index): boolean {
    if (index === 0) {
      return false;
    } else {
      return true;
    }
  }

  innerTabelColspanFn(processLength, obj) {
    if (obj.expand) {
      this.innerTabelColspan += processLength;
    } else {
      this.innerTabelColspan -= processLength;
    }
  }

  // emit event listener
  changePlant(): void {
    this.workHourChangePlant.emit(null);
  }

  changeCustomAndModelType(): void {
    this.workHourChangeCustomAndModelType.emit(null);
  }

  changeCFlow(): void {
    this.workHourChangeCFlow.emit(null);
  }

  customSearch(event): void {
    this.workHourCustomSearch.emit(event);
  }

  changeProName(event): void {
    this.workHourChangeProName.emit(event);
  }

  proCodeSearch(event): void {
    this.workHourProCodeSearch.emit(event);
  }

  proNameSearch(event): void {
    this.workHourProNameSearch.emit(event);
  }

  modelSearch(event): void {
    this.workHourModelSearch.emit(event);
  }

  query(): void {
    this.workHourQuery.emit(this.expandArr);
  }

  download(): void {
    this.expandAll();
    this.tablePaging = false;
    setTimeout(() => {
      this.workHourDownload.emit(null);
      this.tablePaging = true;
      this.expandAll();
    }, 300);
  }

  expandAll() {
    this.expandColumn(this.c2);
    this.expandColumn(this.c3);
    this.expandColumn(this.c4);
    this.expandColumn(this.c5);
    this.expandColumn(this.c6);

  }

  getProcessWidthArr(): string[] {
    const ProcessWidthArr: string[] = [];
    this.processHeaders.forEach(item => ProcessWidthArr.push('100px'));
    return ProcessWidthArr;
  }
  expandColumn(obj: { col: number, expand: boolean }) {
    const widthItem = this.getProcessWidthArr();
    if (obj.expand) {  // 不展開
      obj.expand = false;
      obj.col = 2;
      this.expandCount--;
      // 隱藏多餘的列，因為可展開的列都是一樣寬度的，直接從某位刪除就可以
      this.nzWidthConfig.splice(this.nzWidthConfig.length - widthItem.length, widthItem.length);
    } else {  // 展開
      obj.expand = true;
      obj.col = this.processHeaders.length + 2;
      this.expandCount++;
      // 響應列的調整
      this.nzWidthConfig.push(...widthItem);
    }
    this.innerTabelColspanFn(widthItem.length, obj);
    // 添加的每個製程寬度為100px,2390是沒有展開的行的總寬度
    this.nzScrollRep.x = (2390 + 100 * widthItem.length * this.expandCount).toString() + 'px';
  }

  nzExpandChange(event, data) {
    if (event) {
      if (data[1].length === 0) {
        this.searchModel(data);
      }
    }
  }

  searchModel(data) {
    this.dfcSummaryService.getGroupChildData(data[3], { type: 'workhour' }).then(d => {
      data[1] = d;
    });
  }
}
