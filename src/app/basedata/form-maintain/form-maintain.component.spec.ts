import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormMaintainComponent } from './form-maintain.component';

describe('FormMaintainComponent', () => {
  let component: FormMaintainComponent;
  let fixture: ComponentFixture<FormMaintainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormMaintainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormMaintainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
