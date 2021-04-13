import { SkyeyeModule } from './skyeye.module';

describe('SkyeyeModule', () => {
  let skyeyeModule: SkyeyeModule;

  beforeEach(() => {
    skyeyeModule = new SkyeyeModule();
  });

  it('should create an instance', () => {
    expect(skyeyeModule).toBeTruthy();
  });
});
