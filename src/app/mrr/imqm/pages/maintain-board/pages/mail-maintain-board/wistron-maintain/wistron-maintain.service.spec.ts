import { TestBed } from '@angular/core/testing';

import { WistronMaintainService } from './wistron-maintain.service';

describe('WistronMaintainService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WistronMaintainService = TestBed.get(WistronMaintainService);
    expect(service).toBeTruthy();
  });
});
