import { TestBed } from '@angular/core/testing';

import { MaterialYrService } from './material-yr.service';

describe('MaterialYrService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MaterialYrService = TestBed.get(MaterialYrService);
    expect(service).toBeTruthy();
  });
});
