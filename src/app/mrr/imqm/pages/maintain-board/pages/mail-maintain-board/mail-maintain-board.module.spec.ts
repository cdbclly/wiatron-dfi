import { MailMaintainBoardModule } from './mail-maintain-board.module';

describe('MailMaintainBoardModule', () => {
  let mailMaintainBoardModule: MailMaintainBoardModule;

  beforeEach(() => {
    mailMaintainBoardModule = new MailMaintainBoardModule();
  });

  it('should create an instance', () => {
    expect(mailMaintainBoardModule).toBeTruthy();
  });
});
