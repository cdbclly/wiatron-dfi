import { DfqModule } from './dfq.module';

describe('DfqModule', () => {
  let dfqModule: DfqModule;

  beforeEach(() => {
    dfqModule = new DfqModule();
  });

  it('should create an instance', () => {
    expect(dfqModule).toBeTruthy();
  });
});
