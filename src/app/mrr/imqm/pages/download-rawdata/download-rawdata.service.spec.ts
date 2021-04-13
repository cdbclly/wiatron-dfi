import { TestBed } from '@angular/core/testing';

import { DownloadRawdataService } from './download-rawdata.service';

describe('DownloadRawdataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DownloadRawdataService = TestBed.get(DownloadRawdataService);
    expect(service).toBeTruthy();
  });
});
