import { FalseDataModule } from './false-data.module';

describe('FalseDataModule', () => {
  let falseDataModule: FalseDataModule;

  beforeEach(() => {
    falseDataModule = new FalseDataModule();
  });

  it('should create an instance', () => {
    expect(falseDataModule).toBeTruthy();
  });
});
