import { TestBed } from '@angular/core/testing';

import { DfcSelectService } from './dfc-select.service';

describe('DfcSelectService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DfcSelectService = TestBed.get(DfcSelectService);
    expect(service).toBeTruthy();
  });
});
