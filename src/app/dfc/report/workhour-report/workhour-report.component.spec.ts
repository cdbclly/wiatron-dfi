import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkhourReportComponent } from './workhour-report.component';

describe('WorkhourReportComponent', () => {
  let component: WorkhourReportComponent;
  let fixture: ComponentFixture<WorkhourReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkhourReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkhourReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
