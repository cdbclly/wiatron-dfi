import { TestBed } from '@angular/core/testing';

import { DownexcelService } from './downexcel.service';

describe('DownexcelService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DownexcelService = TestBed.get(DownexcelService);
    expect(service).toBeTruthy();
  });
});
