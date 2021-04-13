import { LightStatusPipe } from './light-status.pipe';

describe('LightStatusPipe', () => {
  it('create an instance', () => {
    const pipe = new LightStatusPipe();
    expect(pipe).toBeTruthy();
  });
});
