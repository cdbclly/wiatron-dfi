import { TestBed } from '@angular/core/testing';

import { IdbookMaintainService } from './idbook-maintain.service';

describe('IdbookMaintainService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IdbookMaintainService = TestBed.get(IdbookMaintainService);
    expect(service).toBeTruthy();
  });
});
