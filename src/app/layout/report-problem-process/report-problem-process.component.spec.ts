import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportProblemProcessComponent } from './report-problem-process.component';

describe('ReportProblemProcessComponent', () => {
  let component: ReportProblemProcessComponent;
  let fixture: ComponentFixture<ReportProblemProcessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportProblemProcessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportProblemProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
