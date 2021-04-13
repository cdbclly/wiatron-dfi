import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkhourReportWaterfallmapComponent } from './workhour-report-waterfallmap.component';

describe('WorkhourReportWaterfallmapComponent', () => {
  let component: WorkhourReportWaterfallmapComponent;
  let fixture: ComponentFixture<WorkhourReportWaterfallmapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkhourReportWaterfallmapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkhourReportWaterfallmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
