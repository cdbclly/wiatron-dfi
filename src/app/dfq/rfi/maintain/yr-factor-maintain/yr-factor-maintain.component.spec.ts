import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YrFactorMaintainComponent } from './yr-factor-maintain.component';

describe('YrFactorMaintainComponent', () => {
  let component: YrFactorMaintainComponent;
  let fixture: ComponentFixture<YrFactorMaintainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YrFactorMaintainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YrFactorMaintainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
