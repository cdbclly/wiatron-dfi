import { TraceBoardModule } from './trace-board.module';

describe('TraceBoardModule', () => {
  let traceBoardModule: TraceBoardModule;

  beforeEach(() => {
    traceBoardModule = new TraceBoardModule();
  });

  it('should create an instance', () => {
    expect(traceBoardModule).toBeTruthy();
  });
});
