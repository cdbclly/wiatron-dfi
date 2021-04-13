import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelDetialsSigingComponent } from './model-detials-siging.component';

describe('ModelDetialsSigingComponent', () => {
  let component: ModelDetialsSigingComponent;
  let fixture: ComponentFixture<ModelDetialsSigingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelDetialsSigingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelDetialsSigingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
