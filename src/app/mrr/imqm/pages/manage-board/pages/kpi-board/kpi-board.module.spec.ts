import { KpiBoardModule } from './kpi-board.module';

describe('KpiBoardModule', () => {
  let kpiBoardModule: KpiBoardModule;

  beforeEach(() => {
    kpiBoardModule = new KpiBoardModule();
  });

  it('should create an instance', () => {
    expect(kpiBoardModule).toBeTruthy();
  });
});
