import { MpModule } from './mp.module';

describe('MpModule', () => {
  let mpModule: MpModule;

  beforeEach(() => {
    mpModule = new MpModule();
  });

  it('should create an instance', () => {
    expect(mpModule).toBeTruthy();
  });
});
