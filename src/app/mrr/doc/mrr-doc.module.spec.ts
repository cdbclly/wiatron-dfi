import { MrrDocModule } from './mrr-doc.module';

describe('MrrDocModule', () => {
  let mrrDocModule: MrrDocModule;

  beforeEach(() => {
    mrrDocModule = new MrrDocModule();
  });

  it('should create an instance', () => {
    expect(mrrDocModule).toBeTruthy();
  });
});
