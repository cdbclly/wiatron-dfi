import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufaturerInputComponent } from './manufaturer-input.component';

describe('ManufaturerInputComponent', () => {
  let component: ManufaturerInputComponent;
  let fixture: ComponentFixture<ManufaturerInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManufaturerInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManufaturerInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
