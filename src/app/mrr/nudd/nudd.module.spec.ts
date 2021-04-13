import { NuddModule } from './nudd.module';

describe('NuddModule', () => {
  let nuddModule: NuddModule;

  beforeEach(() => {
    nuddModule = new NuddModule();
  });

  it('should create an instance', () => {
    expect(nuddModule).toBeTruthy();
  });
});
