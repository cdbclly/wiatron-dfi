import { PlantNamePipe } from './plant-name.pipe';

describe('PlantNamePipe', () => {
  it('create an instance', () => {
    const pipe = new PlantNamePipe();
    expect(pipe).toBeTruthy();
  });
});
