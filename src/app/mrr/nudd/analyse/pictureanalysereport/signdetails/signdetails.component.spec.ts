import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SigndetailsComponent } from './signdetails.component';

describe('SigndetailsComponent', () => {
  let component: SigndetailsComponent;
  let fixture: ComponentFixture<SigndetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SigndetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SigndetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
