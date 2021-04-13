import { MachineModelRoutingModule } from './machine-model-routing.module';

describe('MachineModelRoutingModule', () => {
  let machineModelRoutingModule: MachineModelRoutingModule;

  beforeEach(() => {
    machineModelRoutingModule = new MachineModelRoutingModule();
  });

  it('should create an instance', () => {
    expect(machineModelRoutingModule).toBeTruthy();
  });
});
