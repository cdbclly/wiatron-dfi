import { TestBed } from '@angular/core/testing';

import { SystemParamDetailService } from './system-param-detail.service';

describe('SystemParamDetailService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SystemParamDetailService = TestBed.get(SystemParamDetailService);
    expect(service).toBeTruthy();
  });
});
