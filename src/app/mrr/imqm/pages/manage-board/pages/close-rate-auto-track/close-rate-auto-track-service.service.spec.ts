import { TestBed } from '@angular/core/testing';

import { CloseRateAutoTrackServiceService } from './close-rate-auto-track-service.service';

describe('CloseRateAutoTrackServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CloseRateAutoTrackServiceService = TestBed.get(CloseRateAutoTrackServiceService);
    expect(service).toBeTruthy();
  });
});
