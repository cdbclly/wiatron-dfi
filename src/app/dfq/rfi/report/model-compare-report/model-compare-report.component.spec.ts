import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelCompareReportComponent } from './model-compare-report.component';

describe('ModelCompareReportComponent', () => {
  let component: ModelCompareReportComponent;
  let fixture: ComponentFixture<ModelCompareReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelCompareReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelCompareReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
