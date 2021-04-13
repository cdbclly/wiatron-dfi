import { TestBed } from '@angular/core/testing';

import { BaseDataSigningService } from './base-data-signing.service';

describe('BaseDataSigningService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BaseDataSigningService = TestBed.get(BaseDataSigningService);
    expect(service).toBeTruthy();
  });
});
