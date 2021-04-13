import { TestBed } from '@angular/core/testing';

import { WorkReachingService } from './work-reaching.service';

describe('WorkReachingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WorkReachingService = TestBed.get(WorkReachingService);
    expect(service).toBeTruthy();
  });
});
