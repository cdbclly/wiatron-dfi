import { TestBed } from '@angular/core/testing';

import { DfcKpiService } from './dfc-kpi.service';

describe('DfcKpiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DfcKpiService = TestBed.get(DfcKpiService);
    expect(service).toBeTruthy();
  });
});
