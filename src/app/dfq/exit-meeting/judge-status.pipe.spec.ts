import { JudgeStatusPipe } from './judge-status.pipe';

describe('JudgePipe', () => {
  it('create an instance', () => {
    const pipe = new JudgeStatusPipe();
    expect(pipe).toBeTruthy();
  });
});
