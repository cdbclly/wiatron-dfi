import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelWorkhourComponent } from './model-workhour.component';

describe('ModelWorkhourComponent', () => {
  let component: ModelWorkhourComponent;
  let fixture: ComponentFixture<ModelWorkhourComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelWorkhourComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelWorkhourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
