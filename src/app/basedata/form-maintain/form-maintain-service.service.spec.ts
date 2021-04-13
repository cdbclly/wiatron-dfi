import { TestBed } from '@angular/core/testing';

import { FormMaintainServiceService } from './form-maintain-service.service';

describe('FormMaintainServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FormMaintainServiceService = TestBed.get(FormMaintainServiceService);
    expect(service).toBeTruthy();
  });
});
