import { TestBed } from '@angular/core/testing';

import { MeetingReviewTestService } from './meeting-review-test.service';

describe('MeetingReviewTestService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MeetingReviewTestService = TestBed.get(MeetingReviewTestService);
    expect(service).toBeTruthy();
  });
});
