import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSigningDetailsComponent } from './new-signing-details.component';

describe('NewSigningDetailsComponent', () => {
  let component: NewSigningDetailsComponent;
  let fixture: ComponentFixture<NewSigningDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSigningDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSigningDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
