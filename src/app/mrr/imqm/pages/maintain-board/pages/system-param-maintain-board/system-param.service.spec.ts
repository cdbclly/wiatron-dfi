import { TestBed } from '@angular/core/testing';

import { SystemParamService } from './system-param.service';

describe('SystemParamService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SystemParamService = TestBed.get(SystemParamService);
    expect(service).toBeTruthy();
  });
});
