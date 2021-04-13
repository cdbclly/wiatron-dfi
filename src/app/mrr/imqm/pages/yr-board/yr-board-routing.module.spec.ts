import { YrBoardRoutingModule } from './yr-board-routing.module';

describe('YrBoardRoutingModule', () => {
  let yrBoardRoutingModule: YrBoardRoutingModule;

  beforeEach(() => {
    yrBoardRoutingModule = new YrBoardRoutingModule();
  });

  it('should create an instance', () => {
    expect(yrBoardRoutingModule).toBeTruthy();
  });
});
