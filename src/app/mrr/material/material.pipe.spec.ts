import { OperationPipe } from './material.pipe';

describe('MaterialPipe', () => {
  it('create an instance', () => {
    const pipe = new OperationPipe();
    expect(pipe).toBeTruthy();
  });
});
