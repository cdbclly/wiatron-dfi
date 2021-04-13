import { MrrMaterialModule } from './mrr-material.module';

describe('MrrMaterialModule', () => {
  let mrrMaterialModule: MrrMaterialModule;

  beforeEach(() => {
    mrrMaterialModule = new MrrMaterialModule();
  });

  it('should create an instance', () => {
    expect(mrrMaterialModule).toBeTruthy();
  });
});
