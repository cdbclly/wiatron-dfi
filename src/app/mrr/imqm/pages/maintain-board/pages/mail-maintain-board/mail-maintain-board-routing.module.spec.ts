import { MailMaintainBoardRoutingModule } from './mail-maintain-board-routing.module';

describe('MailMaintainBoardRoutingModule', () => {
  let mailMaintainBoardRoutingModule: MailMaintainBoardRoutingModule;

  beforeEach(() => {
    mailMaintainBoardRoutingModule = new MailMaintainBoardRoutingModule();
  });

  it('should create an instance', () => {
    expect(mailMaintainBoardRoutingModule).toBeTruthy();
  });
});
