import { TestBed } from '@angular/core/testing';

import { FilterSelectService } from './filter-select.service';

describe('FilterSelectService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FilterSelectService = TestBed.get(FilterSelectService);
    expect(service).toBeTruthy();
  });
});
