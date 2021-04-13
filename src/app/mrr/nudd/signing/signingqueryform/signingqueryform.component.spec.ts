import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SigningqueryformComponent } from './signingqueryform.component';

describe('SigningqueryformComponent', () => {
  let component: SigningqueryformComponent;
  let fixture: ComponentFixture<SigningqueryformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SigningqueryformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SigningqueryformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
