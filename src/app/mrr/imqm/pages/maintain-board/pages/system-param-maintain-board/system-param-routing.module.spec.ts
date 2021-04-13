import { SystemParamRoutingModule } from './system-param-routing.module';

describe('SystemParamRoutingModule', () => {
  let systemParamRoutingModule: SystemParamRoutingModule;

  beforeEach(() => {
    systemParamRoutingModule = new SystemParamRoutingModule();
  });

  it('should create an instance', () => {
    expect(systemParamRoutingModule).toBeTruthy();
  });
});
