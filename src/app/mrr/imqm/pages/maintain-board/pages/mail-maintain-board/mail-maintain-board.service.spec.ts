import { TestBed } from '@angular/core/testing';

import { MailMaintainBoardService } from './mail-maintain-board.service';

describe('MailMaintainBoardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MailMaintainBoardService = TestBed.get(MailMaintainBoardService);
    expect(service).toBeTruthy();
  });
});
