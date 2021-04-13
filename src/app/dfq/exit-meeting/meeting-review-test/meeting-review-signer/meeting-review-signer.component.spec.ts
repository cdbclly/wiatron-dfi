import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingReviewSignerComponent } from './meeting-review-signer.component';

describe('MeetingReviewSignerComponent', () => {
  let component: MeetingReviewSignerComponent;
  let fixture: ComponentFixture<MeetingReviewSignerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetingReviewSignerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingReviewSignerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
