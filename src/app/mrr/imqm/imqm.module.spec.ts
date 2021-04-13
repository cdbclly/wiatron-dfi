import { ImqmModule } from './imqm.module';

describe('ImqmModule', () => {
  let imqmModule: ImqmModule;

  beforeEach(() => {
    imqmModule = new ImqmModule();
  });

  it('should create an instance', () => {
    expect(imqmModule).toBeTruthy();
  });
});
