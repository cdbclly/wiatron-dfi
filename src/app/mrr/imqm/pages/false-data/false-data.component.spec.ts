import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FalseDataComponent } from './false-data.component';

describe('FalseDataComponent', () => {
  let component: FalseDataComponent;
  let fixture: ComponentFixture<FalseDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FalseDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FalseDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
