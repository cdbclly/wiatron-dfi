import { TestBed } from '@angular/core/testing';

import { FormsNosReportService } from './forms-nos-report.service';

describe('FormsNosReportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FormsNosReportService = TestBed.get(FormsNosReportService);
    expect(service).toBeTruthy();
  });
});
