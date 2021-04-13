import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainTainComponent } from './main-tain.component';

describe('MainTainComponent', () => {
  let component: MainTainComponent;
  let fixture: ComponentFixture<MainTainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainTainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainTainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
