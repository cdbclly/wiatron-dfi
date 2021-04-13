import { TestBed } from '@angular/core/testing';

import { UploadQueryService } from './upload-query.service';

describe('UploadQueryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UploadQueryService = TestBed.get(UploadQueryService);
    expect(service).toBeTruthy();
  });
});
