import { YrBoardModule } from './yr-board.module';

describe('YrBoardModule', () => {
  let yrBoardModule: YrBoardModule;

  beforeEach(() => {
    yrBoardModule = new YrBoardModule();
  });

  it('should create an instance', () => {
    expect(yrBoardModule).toBeTruthy();
  });
});
