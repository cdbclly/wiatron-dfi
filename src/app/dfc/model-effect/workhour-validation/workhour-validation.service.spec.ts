import { TestBed } from '@angular/core/testing';

import { WorkhourValidationService } from './workhour-validation.service';

describe('WorkhourValidationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WorkhourValidationService = TestBed.get(WorkhourValidationService);
    expect(service).toBeTruthy();
  });
});
