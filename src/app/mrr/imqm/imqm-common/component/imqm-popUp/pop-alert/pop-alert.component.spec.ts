import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopAlertComponent } from './pop-alert.component';

describe('PopAlertComponent', () => {
  let component: PopAlertComponent;
  let fixture: ComponentFixture<PopAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
