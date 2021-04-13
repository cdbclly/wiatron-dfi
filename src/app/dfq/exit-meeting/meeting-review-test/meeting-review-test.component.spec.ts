import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingReviewTestComponent } from './meeting-review-test.component';

describe('MeetingReviewTestComponent', () => {
  let component: MeetingReviewTestComponent;
  let fixture: ComponentFixture<MeetingReviewTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetingReviewTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingReviewTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
