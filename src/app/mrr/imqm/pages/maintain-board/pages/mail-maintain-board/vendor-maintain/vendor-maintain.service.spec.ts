import { TestBed } from '@angular/core/testing';

import { VendorMaintainService } from './vendor-maintain.service';

describe('VendorMaintainService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VendorMaintainService = TestBed.get(VendorMaintainService);
    expect(service).toBeTruthy();
  });
});
