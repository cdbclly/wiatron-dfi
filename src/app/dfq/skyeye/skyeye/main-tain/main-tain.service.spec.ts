import { TestBed } from '@angular/core/testing';

import { MainTainService } from './main-tain.service';

describe('MainTainService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MainTainService = TestBed.get(MainTainService);
    expect(service).toBeTruthy();
  });
});
