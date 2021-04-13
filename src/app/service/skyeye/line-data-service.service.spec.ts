import { TestBed } from '@angular/core/testing';

import { LineDataServiceService } from './line-data-service.service';

describe('LineDataServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LineDataServiceService = TestBed.get(LineDataServiceService);
    expect(service).toBeTruthy();
  });
});
