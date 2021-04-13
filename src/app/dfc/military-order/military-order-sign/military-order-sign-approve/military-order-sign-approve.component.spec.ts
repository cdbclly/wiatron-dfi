import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MilitaryOrderSignApproveComponent } from './military-order-sign-approve.component';

describe('MilitaryOrderSignApproveComponent', () => {
  let component: MilitaryOrderSignApproveComponent;
  let fixture: ComponentFixture<MilitaryOrderSignApproveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MilitaryOrderSignApproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MilitaryOrderSignApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
