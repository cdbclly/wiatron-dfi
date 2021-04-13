import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SigningdetailComponent } from './signingdetail.component';

describe('SigningdetailComponent', () => {
  let component: SigningdetailComponent;
  let fixture: ComponentFixture<SigningdetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SigningdetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SigningdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
