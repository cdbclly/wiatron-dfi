import { TestBed } from '@angular/core/testing';

import { PictureUploadService } from './picture-upload.service';

describe('PictureUploadService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PictureUploadService = TestBed.get(PictureUploadService);
    expect(service).toBeTruthy();
  });
});
