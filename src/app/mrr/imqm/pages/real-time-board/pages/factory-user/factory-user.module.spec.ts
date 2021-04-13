import { FactoryUserModule } from './factory-user.module';

describe('FactoryUserModule', () => {
  let factoryUserModule: FactoryUserModule;

  beforeEach(() => {
    factoryUserModule = new FactoryUserModule();
  });

  it('should create an instance', () => {
    expect(factoryUserModule).toBeTruthy();
  });
});
