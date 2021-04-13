import { BasedataModule } from './basedata.module';

describe('BasedataModule', () => {
  let basedataModule: BasedataModule;

  beforeEach(() => {
    basedataModule = new BasedataModule();
  });

  it('should create an instance', () => {
    expect(basedataModule).toBeTruthy();
  });
});
