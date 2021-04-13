import { TestBed } from '@angular/core/testing';

import { ModelCompareService } from './model-compare.service';

describe('ModelCompareService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ModelCompareService = TestBed.get(ModelCompareService);
    expect(service).toBeTruthy();
  });
});
