import { TestBed } from '@angular/core/testing';

import { NuddUploadService } from './nudd-upload.service';

describe('NuddUploadService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NuddUploadService = TestBed.get(NuddUploadService);
    expect(service).toBeTruthy();
  });
});
