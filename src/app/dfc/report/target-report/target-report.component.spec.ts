import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetReportComponent } from './target-report.component';

describe('TargetReportComponent', () => {
  let component: TargetReportComponent;
  let fixture: ComponentFixture<TargetReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TargetReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TargetReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
