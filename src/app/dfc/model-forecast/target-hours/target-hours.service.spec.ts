import { TestBed } from '@angular/core/testing';

import { TargetHoursService } from './target-hours.service';

describe('TargetHoursService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TargetHoursService = TestBed.get(TargetHoursService);
    expect(service).toBeTruthy();
  });
});
