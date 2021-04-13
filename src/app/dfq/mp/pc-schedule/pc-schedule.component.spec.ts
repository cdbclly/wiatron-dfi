import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PcScheduleComponent } from './pc-schedule.component';

describe('PcScheduleComponent', () => {
  let component: PcScheduleComponent;
  let fixture: ComponentFixture<PcScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PcScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PcScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
