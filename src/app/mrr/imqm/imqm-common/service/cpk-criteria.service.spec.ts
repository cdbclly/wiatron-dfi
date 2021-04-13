import { TestBed } from '@angular/core/testing';

import { CpkCriteriaService } from './cpk-criteria.service';

describe('CpkCriteriaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CpkCriteriaService = TestBed.get(CpkCriteriaService);
    expect(service).toBeTruthy();
  });
});
