import { StatusCheckPipe } from './status-pipe.pipe';

describe('StatusCheckPipe', () => {
  it('create an instance', () => {
    const pipe = new StatusCheckPipe();
    expect(pipe).toBeTruthy();
  });
});
