import { WorkflowStatusPipe } from './workflow-status.pipe';

describe('WorkflowStatusPipe', () => {
  it('create an instance', () => {
    const pipe = new WorkflowStatusPipe();
    expect(pipe).toBeTruthy();
  });
});
