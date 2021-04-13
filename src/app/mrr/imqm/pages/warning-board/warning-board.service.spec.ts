import { TestBed } from '@angular/core/testing';

import { WarningBoardService } from './warning-board.service';

describe('WarningBoardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WarningBoardService = TestBed.get(WarningBoardService);
    expect(service).toBeTruthy();
  });
});
