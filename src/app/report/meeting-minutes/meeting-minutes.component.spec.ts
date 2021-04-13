import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingMinutesComponent } from './meeting-minutes.component';

describe('MeetingMinutesComponent', () => {
  let component: MeetingMinutesComponent;
  let fixture: ComponentFixture<MeetingMinutesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetingMinutesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingMinutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
