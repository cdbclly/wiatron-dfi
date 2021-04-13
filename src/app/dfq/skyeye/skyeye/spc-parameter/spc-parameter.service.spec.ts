import { TestBed } from '@angular/core/testing';

import { SpcParameterService } from './spc-parameter.service';

describe('SpcParameterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SpcParameterService = TestBed.get(SpcParameterService);
    expect(service).toBeTruthy();
  });
});
