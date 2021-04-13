import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorMaintainComponent } from './vendor-maintain.component';

describe('VendorMaintainComponent', () => {
  let component: VendorMaintainComponent;
  let fixture: ComponentFixture<VendorMaintainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorMaintainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorMaintainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
