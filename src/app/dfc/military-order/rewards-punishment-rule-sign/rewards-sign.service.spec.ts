import { TestBed } from '@angular/core/testing';

import { RewardsSignService } from './rewards-sign.service';

describe('RewardsSignService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RewardsSignService = TestBed.get(RewardsSignService);
    expect(service).toBeTruthy();
  });
});
