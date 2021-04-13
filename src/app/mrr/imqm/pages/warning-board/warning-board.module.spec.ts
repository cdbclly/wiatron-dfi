import { WarningBoardModule } from './warning-board.module';

describe('WarningBoardModule', () => {
  let warningBoardModule: WarningBoardModule;

  beforeEach(() => {
    warningBoardModule = new WarningBoardModule();
  });

  it('should create an instance', () => {
    expect(warningBoardModule).toBeTruthy();
  });
});
