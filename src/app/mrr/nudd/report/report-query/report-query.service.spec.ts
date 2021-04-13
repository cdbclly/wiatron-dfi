import { TestBed } from '@angular/core/testing';

import { ReportQueryService } from './report-query.service';

describe('ReportQueryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReportQueryService = TestBed.get(ReportQueryService);
    expect(service).toBeTruthy();
  });
});
