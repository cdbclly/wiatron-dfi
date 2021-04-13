import { TestBed } from '@angular/core/testing';

import { SqmsIqcService } from './sqms-iqc.service';

describe('SqmsIqcService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SqmsIqcService = TestBed.get(SqmsIqcService);
    expect(service).toBeTruthy();
  });
});
