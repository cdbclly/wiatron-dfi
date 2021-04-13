import { TestBed } from '@angular/core/testing';

import { EsDataServiceService } from './es-data-service.service';

describe('EsDataServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EsDataServiceService = TestBed.get(EsDataServiceService);
    expect(service).toBeTruthy();
  });
});
