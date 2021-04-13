import { TestBed } from '@angular/core/testing';

import { PicturereportService } from './picturereport.service';

describe('PicturereportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PicturereportService = TestBed.get(PicturereportService);
    expect(service).toBeTruthy();
  });
});
