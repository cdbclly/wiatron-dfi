import { TestBed } from '@angular/core/testing';

import { WorkhourReviewService } from './workhour-review.service';

describe('WorkhourReviewService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WorkhourReviewService = TestBed.get(WorkhourReviewService);
    expect(service).toBeTruthy();
  });
});
