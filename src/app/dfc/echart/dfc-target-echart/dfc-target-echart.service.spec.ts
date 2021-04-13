import { TestBed } from '@angular/core/testing';

import { DfcTargetEchartService } from './dfc-target-echart.service';

describe('DfcTargetEchartService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DfcTargetEchartService = TestBed.get(DfcTargetEchartService);
    expect(service).toBeTruthy();
  });
});
