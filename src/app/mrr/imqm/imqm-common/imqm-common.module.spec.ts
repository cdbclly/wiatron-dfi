import { ImqmCommonModule } from './imqm-common.module';

describe('ImqmCommonModule', () => {
  let imqmCommonModule: ImqmCommonModule;

  beforeEach(() => {
    imqmCommonModule = new ImqmCommonModule();
  });

  it('should create an instance', () => {
    expect(imqmCommonModule).toBeTruthy();
  });
});
