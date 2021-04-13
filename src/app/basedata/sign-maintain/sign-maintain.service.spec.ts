import { TestBed } from '@angular/core/testing';

import { SignMaintainService } from './sign-maintain.service';

describe('SignMaintainService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SignMaintainService = TestBed.get(SignMaintainService);
    expect(service).toBeTruthy();
  });
});
