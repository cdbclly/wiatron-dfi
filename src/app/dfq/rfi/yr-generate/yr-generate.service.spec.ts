import { TestBed } from '@angular/core/testing';

import { YrGenerateService } from './yr-generate.service';

describe('YrGenerateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: YrGenerateService = TestBed.get(YrGenerateService);
    expect(service).toBeTruthy();
  });
});
