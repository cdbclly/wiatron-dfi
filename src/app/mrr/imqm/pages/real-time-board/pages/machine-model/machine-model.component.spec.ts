import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineModelComponent } from './machine-model.component';

describe('MachineModelComponent', () => {
  let component: MachineModelComponent;
  let fixture: ComponentFixture<MachineModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MachineModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
