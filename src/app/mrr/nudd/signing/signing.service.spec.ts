import { TestBed } from '@angular/core/testing';

import { SigningService } from './signing.service';

describe('SigningService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SigningService = TestBed.get(SigningService);
    expect(service).toBeTruthy();
  });
});
