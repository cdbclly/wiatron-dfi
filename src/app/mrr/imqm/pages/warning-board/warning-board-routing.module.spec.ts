import { WarningBoardRoutingModule } from './warning-board-routing.module';

describe('WarningBoardRoutingModule', () => {
  let warningBoardRoutingModule: WarningBoardRoutingModule;

  beforeEach(() => {
    warningBoardRoutingModule = new WarningBoardRoutingModule();
  });

  it('should create an instance', () => {
    expect(warningBoardRoutingModule).toBeTruthy();
  });
});
