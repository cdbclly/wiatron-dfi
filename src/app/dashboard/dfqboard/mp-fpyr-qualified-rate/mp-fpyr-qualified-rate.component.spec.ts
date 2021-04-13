import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MpFpyrQualifieldRateComponent } from './mp-fpyr-qualified-rate.component';

describe('MpDashboardComponent', () => {
  let component: MpFpyrQualifieldRateComponent;
  let fixture: ComponentFixture<MpFpyrQualifieldRateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MpFpyrQualifieldRateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MpFpyrQualifieldRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
