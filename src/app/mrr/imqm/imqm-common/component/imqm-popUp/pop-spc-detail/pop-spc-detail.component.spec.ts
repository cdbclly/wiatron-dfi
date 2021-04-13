import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopSpcDetailComponent } from './pop-spc-detail.component';

describe('PopSpcDetailComponent', () => {
  let component: PopSpcDetailComponent;
  let fixture: ComponentFixture<PopSpcDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopSpcDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopSpcDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
