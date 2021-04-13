import { RealTimeBoardModule } from './real-time-board.module';

describe('RealTimeBoardModule', () => {
  let realTimeBoardModule: RealTimeBoardModule;

  beforeEach(() => {
    realTimeBoardModule = new RealTimeBoardModule();
  });

  it('should create an instance', () => {
    expect(realTimeBoardModule).toBeTruthy();
  });
});
