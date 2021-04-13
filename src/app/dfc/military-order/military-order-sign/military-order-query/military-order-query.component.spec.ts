import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MilitaryOrderQueryComponent } from './military-order-query.component';

describe('MilitaryOrderQueryComponent', () => {
  let component: MilitaryOrderQueryComponent;
  let fixture: ComponentFixture<MilitaryOrderQueryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MilitaryOrderQueryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MilitaryOrderQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
