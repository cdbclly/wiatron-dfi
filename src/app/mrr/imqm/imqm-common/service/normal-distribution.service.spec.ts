import { TestBed } from '@angular/core/testing';

import { NormalDistributionService } from './normal-distribution.service';

describe('NormalDistributionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NormalDistributionService = TestBed.get(NormalDistributionService);
    expect(service).toBeTruthy();
  });
});
