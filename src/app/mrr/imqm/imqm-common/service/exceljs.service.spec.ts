import { TestBed } from '@angular/core/testing';

import { ExceljsService } from './exceljs.service';

describe('ExceljsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExceljsService = TestBed.get(ExceljsService);
    expect(service).toBeTruthy();
  });
});
