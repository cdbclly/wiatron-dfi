import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FactoryUserComponent } from './factory-user.component';

describe('FactoryUserComponent', () => {
  let component: FactoryUserComponent;
  let fixture: ComponentFixture<FactoryUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FactoryUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FactoryUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
