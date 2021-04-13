import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopDrComponent } from './pop-dr.component';

describe('PopDrComponent', () => {
  let component: PopDrComponent;
  let fixture: ComponentFixture<PopDrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopDrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopDrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
