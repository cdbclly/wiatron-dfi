import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelMohComponent } from './model-moh.component';

describe('ModelMohComponent', () => {
  let component: ModelMohComponent;
  let fixture: ComponentFixture<ModelMohComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelMohComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelMohComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
