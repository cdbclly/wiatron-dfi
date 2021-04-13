import { TestBed } from '@angular/core/testing';

import { DfcCommonService } from './dfc-common.service';

describe('DfcCommonService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DfcCommonService = TestBed.get(DfcCommonService);
    expect(service).toBeTruthy();
  });
});
