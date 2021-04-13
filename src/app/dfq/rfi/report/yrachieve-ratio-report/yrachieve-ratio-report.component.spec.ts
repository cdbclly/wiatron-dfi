import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YrachieveRatioReportComponent } from './yrachieve-ratio-report.component';

describe('YrachieveRatioReportComponent', () => {
  let component: YrachieveRatioReportComponent;
  let fixture: ComponentFixture<YrachieveRatioReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YrachieveRatioReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YrachieveRatioReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
