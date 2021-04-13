import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpcParameterComponent } from './spc-parameter.component';

describe('SpcParameterComponent', () => {
  let component: SpcParameterComponent;
  let fixture: ComponentFixture<SpcParameterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpcParameterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpcParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
