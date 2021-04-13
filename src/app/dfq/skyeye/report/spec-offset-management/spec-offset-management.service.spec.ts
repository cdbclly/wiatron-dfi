import { TestBed } from '@angular/core/testing';

import { SpecOffsetManagementService } from './spec-offset-management.service';

describe('SpecOffsetManagementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SpecOffsetManagementService = TestBed.get(SpecOffsetManagementService);
    expect(service).toBeTruthy();
  });
});
