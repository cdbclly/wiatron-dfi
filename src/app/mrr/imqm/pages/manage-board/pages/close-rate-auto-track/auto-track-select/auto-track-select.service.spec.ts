import { TestBed } from '@angular/core/testing';

import { AutoTrackSelectService } from './auto-track-select.service';

describe('AutoTrackSelectService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AutoTrackSelectService = TestBed.get(AutoTrackSelectService);
    expect(service).toBeTruthy();
  });
});
