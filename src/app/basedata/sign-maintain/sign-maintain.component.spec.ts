import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignMaintainComponent } from './sign-maintain.component';

describe('SignMaintainComponent', () => {
  let component: SignMaintainComponent;
  let fixture: ComponentFixture<SignMaintainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignMaintainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignMaintainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
