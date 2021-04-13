import { TestBed } from '@angular/core/testing';

import { NewmaterialService } from './newmaterial.service';

describe('NewmaterialService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NewmaterialService = TestBed.get(NewmaterialService);
    expect(service).toBeTruthy();
  });
});
