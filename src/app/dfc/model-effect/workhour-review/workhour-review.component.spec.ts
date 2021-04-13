import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkhourReviewComponent } from './workhour-review.component';

describe('WorkhourReviewComponent', () => {
  let component: WorkhourReviewComponent;
  let fixture: ComponentFixture<WorkhourReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkhourReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkhourReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
