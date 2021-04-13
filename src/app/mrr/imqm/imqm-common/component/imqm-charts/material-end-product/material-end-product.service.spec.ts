import { TestBed } from '@angular/core/testing';

import { MaterialEndProductService } from './material-end-product.service';

describe('MaterialEndProductService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MaterialEndProductService = TestBed.get(MaterialEndProductService);
    expect(service).toBeTruthy();
  });
});
