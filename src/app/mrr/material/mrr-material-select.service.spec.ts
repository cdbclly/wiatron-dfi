import { TestBed } from '@angular/core/testing';

import { MrrMaterialSelectService } from './mrr-material-select.service';

describe('MrrMaterialSelectService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MrrMaterialSelectService = TestBed.get(MrrMaterialSelectService);
    expect(service).toBeTruthy();
  });
});
