import { MachineModelModule } from './machine-model.module';

describe('MachineModelModule', () => {
  let machineModelModule: MachineModelModule;

  beforeEach(() => {
    machineModelModule = new MachineModelModule();
  });

  it('should create an instance', () => {
    expect(machineModelModule).toBeTruthy();
  });
});
