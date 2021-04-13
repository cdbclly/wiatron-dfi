import { TestBed } from '@angular/core/testing';

import { PictureanalyseService } from './pictureanalyse.service';

describe('PictureanalyseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PictureanalyseService = TestBed.get(PictureanalyseService);
    expect(service).toBeTruthy();
  });
});
