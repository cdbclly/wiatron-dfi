import { RfiModule } from './rfi.module';

describe('RfiModule', () => {
  let rfiModule: RfiModule;

  beforeEach(() => {
    rfiModule = new RfiModule();
  });

  it('should create an instance', () => {
    expect(rfiModule).toBeTruthy();
  });
});
