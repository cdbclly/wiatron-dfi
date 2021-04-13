import { TestBed } from '@angular/core/testing';

import { MufrpiedataService } from './mufrpiedata.service';

describe('MufrpiedataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MufrpiedataService = TestBed.get(MufrpiedataService);
    expect(service).toBeTruthy();
  });
});
