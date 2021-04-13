import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryWorkHourComponent } from './summary-work-hour.component';

describe('SummaryWorkHourComponent', () => {
  let component: SummaryWorkHourComponent;
  let fixture: ComponentFixture<SummaryWorkHourComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummaryWorkHourComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryWorkHourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
