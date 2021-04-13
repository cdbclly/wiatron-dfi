import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewmodelMaintainComponent } from './newmodel-maintain.component';

describe('NewmodelMaintainComponent', () => {
  let component: NewmodelMaintainComponent;
  let fixture: ComponentFixture<NewmodelMaintainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewmodelMaintainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewmodelMaintainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
