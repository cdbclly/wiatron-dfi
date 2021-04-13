import { TestBed } from '@angular/core/testing';

import { FileMaintainBypassService } from './file-maintain-bypass.service';

describe('FileMaintainBypassService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FileMaintainBypassService = TestBed.get(FileMaintainBypassService);
    expect(service).toBeTruthy();
  });
});
