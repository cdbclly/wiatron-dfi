import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MilitaryOrderSignComponent } from './military-order-sign.component';

describe('MilitaryOrderSignComponent', () => {
  let component: MilitaryOrderSignComponent;
  let fixture: ComponentFixture<MilitaryOrderSignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MilitaryOrderSignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MilitaryOrderSignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
