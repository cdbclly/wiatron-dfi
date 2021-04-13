import { TestBed } from '@angular/core/testing';

import { TestMaintainService } from './test-maintain.service';

describe('TestMaintainService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TestMaintainService = TestBed.get(TestMaintainService);
    expect(service).toBeTruthy();
  });
});
