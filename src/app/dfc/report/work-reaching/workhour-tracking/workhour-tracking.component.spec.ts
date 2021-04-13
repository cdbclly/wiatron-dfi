import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkhourTrackingComponent } from './workhour-tracking.component';

describe('WorkhourTrackingComponent', () => {
  let component: WorkhourTrackingComponent;
  let fixture: ComponentFixture<WorkhourTrackingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkhourTrackingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkhourTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
