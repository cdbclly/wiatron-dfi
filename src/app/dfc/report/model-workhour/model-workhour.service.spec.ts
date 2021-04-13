import { TestBed } from '@angular/core/testing';

import { ModelWorkhourService } from './model-workhour.service';

describe('ModelWorkhourService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ModelWorkhourService = TestBed.get(ModelWorkhourService);
    expect(service).toBeTruthy();
  });
});
