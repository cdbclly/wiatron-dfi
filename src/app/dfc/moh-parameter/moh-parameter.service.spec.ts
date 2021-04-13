import { TestBed } from '@angular/core/testing';

import { MohParameterService } from './moh-parameter.service';

describe('MohParameterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MohParameterService = TestBed.get(MohParameterService);
    expect(service).toBeTruthy();
  });
});
