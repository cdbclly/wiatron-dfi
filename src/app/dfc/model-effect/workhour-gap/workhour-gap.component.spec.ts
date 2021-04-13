import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkhourGapComponent } from './workhour-gap.component';

describe('WorkhourGapComponent', () => {
  let component: WorkhourGapComponent;
  let fixture: ComponentFixture<WorkhourGapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkhourGapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkhourGapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
