import { TestBed } from '@angular/core/testing';

import { AbnormalBoardService } from './abnormal-board.service';

describe('AbnormalBoardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AbnormalBoardService = TestBed.get(AbnormalBoardService);
    expect(service).toBeTruthy();
  });
});
