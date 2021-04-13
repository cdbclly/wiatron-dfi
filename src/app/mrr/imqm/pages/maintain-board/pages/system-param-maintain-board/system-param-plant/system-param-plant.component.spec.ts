import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemParamPlantComponent } from './system-param-plant.component';

describe('SystemParamPlantComponent', () => {
  let component: SystemParamPlantComponent;
  let fixture: ComponentFixture<SystemParamPlantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemParamPlantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemParamPlantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
