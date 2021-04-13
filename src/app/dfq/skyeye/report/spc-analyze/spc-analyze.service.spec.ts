import { TestBed } from '@angular/core/testing';

import { SpcAnalyzeService } from './spc-analyze.service';

describe('SpcAnalyzeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SpcAnalyzeService = TestBed.get(SpcAnalyzeService);
    expect(service).toBeTruthy();
  });
});
