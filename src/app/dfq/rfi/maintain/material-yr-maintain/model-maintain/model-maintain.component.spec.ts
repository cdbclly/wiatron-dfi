import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelMaintainComponent } from './model-maintain.component';

describe('ModelMaintainComponent', () => {
  let component: ModelMaintainComponent;
  let fixture: ComponentFixture<ModelMaintainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelMaintainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelMaintainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
