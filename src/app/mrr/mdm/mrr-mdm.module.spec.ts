import { MrrMdmModule } from './mrr-mdm.module';

describe('MrrMdmModule', () => {
  let mrrMdmModule: MrrMdmModule;

  beforeEach(() => {
    mrrMdmModule = new MrrMdmModule();
  });

  it('should create an instance', () => {
    expect(mrrMdmModule).toBeTruthy();
  });
});
