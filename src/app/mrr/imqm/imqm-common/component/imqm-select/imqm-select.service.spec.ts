import { TestBed } from '@angular/core/testing';

import { ImqmSelectService } from './imqm-select.service';

describe('ImqmSelectService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ImqmSelectService = TestBed.get(ImqmSelectService);
    expect(service).toBeTruthy();
  });
});
