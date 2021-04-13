import { TestBed } from '@angular/core/testing';

import { NewmodelMaintainService } from './newmodel-maintain.service';

describe('NewmodelMaintainService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NewmodelMaintainService = TestBed.get(NewmodelMaintainService);
    expect(service).toBeTruthy();
  });
});
