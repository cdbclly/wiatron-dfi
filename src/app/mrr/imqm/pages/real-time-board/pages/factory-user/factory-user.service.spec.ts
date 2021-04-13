import { TestBed } from '@angular/core/testing';

import { FactoryUserService } from './factory-user.service';

describe('FactoryUserService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FactoryUserService = TestBed.get(FactoryUserService);
    expect(service).toBeTruthy();
  });
});
