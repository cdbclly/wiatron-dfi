import { TestBed } from '@angular/core/testing';

import { YrBoardService } from './yr-board.service';

describe('YrBoardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: YrBoardService = TestBed.get(YrBoardService);
    expect(service).toBeTruthy();
  });
});
