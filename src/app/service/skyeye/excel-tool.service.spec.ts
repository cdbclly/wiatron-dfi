import { TestBed } from '@angular/core/testing';

import { ExcelToolService } from './excel-tool.service';

describe('ExcelToolService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExcelToolService = TestBed.get(ExcelToolService);
    expect(service).toBeTruthy();
  });
});
