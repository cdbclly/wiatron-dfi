import { AbnormalBoardModule } from './abnormal-board.module';

describe('AbnormalBoardModule', () => {
  let abnormalBoardModule: AbnormalBoardModule;

  beforeEach(() => {
    abnormalBoardModule = new AbnormalBoardModule();
  });

  it('should create an instance', () => {
    expect(abnormalBoardModule).toBeTruthy();
  });
});
