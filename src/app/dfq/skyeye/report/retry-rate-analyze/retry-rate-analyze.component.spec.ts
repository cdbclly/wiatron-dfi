import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetryRateAnalyzeComponent } from './retry-rate-analyze.component';

describe('RetryRateAnalyzeComponent', () => {
  let component: RetryRateAnalyzeComponent;
  let fixture: ComponentFixture<RetryRateAnalyzeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetryRateAnalyzeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetryRateAnalyzeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
