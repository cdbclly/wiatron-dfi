import { MaintainBoardModule } from './maintain-board.module';

describe('MaintainBoardModule', () => {
  let maintainBoardModule: MaintainBoardModule;

  beforeEach(() => {
    maintainBoardModule = new MaintainBoardModule();
  });

  it('should create an instance', () => {
    expect(maintainBoardModule).toBeTruthy();
  });
});
