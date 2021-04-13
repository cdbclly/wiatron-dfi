import { TestBed } from '@angular/core/testing';

import { DfcSignHistoryService } from './dfc-sign-history.service';

describe('DfcSignHistoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DfcSignHistoryService = TestBed.get(DfcSignHistoryService);
    expect(service).toBeTruthy();
  });
});
