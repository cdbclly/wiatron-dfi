import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MilitaryOrderPrintComponent } from './military-order-print.component';

describe('MilitaryOrderPrintComponent', () => {
  let component: MilitaryOrderPrintComponent;
  let fixture: ComponentFixture<MilitaryOrderPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MilitaryOrderPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MilitaryOrderPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
