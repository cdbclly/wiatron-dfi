import { TestBed } from '@angular/core/testing';

import { NewmodelService } from './newmodel.service';

describe('NewmodelService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NewmodelService = TestBed.get(NewmodelService);
    expect(service).toBeTruthy();
  });
});
