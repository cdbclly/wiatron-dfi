import { TestBed } from '@angular/core/testing';

import { DfcSelectNewService } from './dfc-select-new.service';

describe('DfcSelectNewService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DfcSelectNewService = TestBed.get(DfcSelectNewService);
    expect(service).toBeTruthy();
  });
});
