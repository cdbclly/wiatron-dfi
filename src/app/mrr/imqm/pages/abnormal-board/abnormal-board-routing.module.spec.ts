import { AbnormalBoardRoutingModule } from './abnormal-board-routing.module';

describe('AbnormalBoardRoutingModule', () => {
  let abnormalBoardRoutingModule: AbnormalBoardRoutingModule;

  beforeEach(() => {
    abnormalBoardRoutingModule = new AbnormalBoardRoutingModule();
  });

  it('should create an instance', () => {
    expect(abnormalBoardRoutingModule).toBeTruthy();
  });
});
