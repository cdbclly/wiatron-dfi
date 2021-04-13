import { SigningStatusPipe } from './signing-status.pipe';

describe('SigningStatusPipe', () => {
  it('create an instance', () => {
    const pipe = new SigningStatusPipe();
    expect(pipe).toBeTruthy();
  });
});
