import { TestBed } from '@angular/core/testing';

import { ExcelToolsService } from './excel-tools.service';

describe('ExcelToolsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExcelToolsService = TestBed.get(ExcelToolsService);
    expect(service).toBeTruthy();
  });
});
