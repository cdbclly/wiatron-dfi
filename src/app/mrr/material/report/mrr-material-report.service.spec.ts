import { TestBed } from '@angular/core/testing';

import { MrrMaterialReportService } from './mrr-material-report.service';

describe('MrrMaterialReportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MrrMaterialReportService = TestBed.get(MrrMaterialReportService);
    expect(service).toBeTruthy();
  });
});
