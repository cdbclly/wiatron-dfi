import { TestBed } from '@angular/core/testing';

import { FalseDataService } from './false-data.service';

describe('FalseDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FalseDataService = TestBed.get(FalseDataService);
    expect(service).toBeTruthy();
  });
});
