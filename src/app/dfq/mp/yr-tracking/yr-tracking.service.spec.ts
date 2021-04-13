import { TestBed } from '@angular/core/testing';

import { YrTrackingService } from './yr-tracking.service';

describe('YrTrackingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: YrTrackingService = TestBed.get(YrTrackingService);
    expect(service).toBeTruthy();
  });
});
