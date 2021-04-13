import { TestBed } from '@angular/core/testing';

import { SqmBaseDataService } from './sqm-base-data.service';

describe('SqmBaseDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SqmBaseDataService = TestBed.get(SqmBaseDataService);
    expect(service).toBeTruthy();
  });
});
