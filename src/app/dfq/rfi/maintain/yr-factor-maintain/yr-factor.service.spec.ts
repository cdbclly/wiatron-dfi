import { TestBed } from '@angular/core/testing';

import { YrFactorService } from './yr-factor.service';

describe('YrFactorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: YrFactorService = TestBed.get(YrFactorService);
    expect(service).toBeTruthy();
  });
});
