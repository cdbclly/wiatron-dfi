import { TestBed } from '@angular/core/testing';

import { LlUploadService } from './ll-upload.service';

describe('LlUploadService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LlUploadService = TestBed.get(LlUploadService);
    expect(service).toBeTruthy();
  });
});
