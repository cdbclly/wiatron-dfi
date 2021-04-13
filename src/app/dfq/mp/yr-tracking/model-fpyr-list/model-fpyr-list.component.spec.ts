import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelFpyrListComponent } from './model-fpyr-list.component';

describe('MainTainComponent', () => {
  let component: ModelFpyrListComponent;
  let fixture: ComponentFixture<ModelFpyrListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelFpyrListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelFpyrListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
