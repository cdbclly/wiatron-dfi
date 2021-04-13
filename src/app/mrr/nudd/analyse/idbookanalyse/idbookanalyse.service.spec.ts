import { TestBed } from '@angular/core/testing';

import { IdbookanalyseService } from './idbookanalyse.service';

describe('IdbookanalyseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IdbookanalyseService = TestBed.get(IdbookanalyseService);
    expect(service).toBeTruthy();
  });
});
