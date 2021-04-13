import { SystemParamModule } from './system-param.module';

describe('SystemParamModule', () => {
  let systemParamModule: SystemParamModule;

  beforeEach(() => {
    systemParamModule = new SystemParamModule();
  });

  it('should create an instance', () => {
    expect(systemParamModule).toBeTruthy();
  });
});
