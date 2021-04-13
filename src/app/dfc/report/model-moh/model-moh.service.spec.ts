import { TestBed } from '@angular/core/testing';

import { ModelMohService } from './model-moh.service';

describe('ModelMohService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ModelMohService = TestBed.get(ModelMohService);
    expect(service).toBeTruthy();
  });
});
