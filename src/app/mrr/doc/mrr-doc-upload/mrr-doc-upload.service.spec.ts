import { TestBed } from '@angular/core/testing';

import { MrrDocUploadService } from './mrr-doc-upload.service';

describe('MrrDocUploadService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MrrDocUploadService = TestBed.get(MrrDocUploadService);
    expect(service).toBeTruthy();
  });
});
