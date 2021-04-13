import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemParamComponent } from './system-param.component';

describe('SystemParamComponent', () => {
  let component: SystemParamComponent;
  let fixture: ComponentFixture<SystemParamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemParamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemParamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
