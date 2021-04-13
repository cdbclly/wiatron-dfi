import { DfcModule } from './dfc.module';

describe('DfcModule', () => {
  let dfcModule: DfcModule;

  beforeEach(() => {
    dfcModule = new DfcModule();
  });

  it('should create an instance', () => {
    expect(dfcModule).toBeTruthy();
  });
});
