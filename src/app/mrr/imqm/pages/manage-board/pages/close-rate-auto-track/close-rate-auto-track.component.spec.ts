import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseRateAutoTrackComponent } from './close-rate-auto-track.component';

describe('CloseRateAutoTrackComponent', () => {
  let component: CloseRateAutoTrackComponent;
  let fixture: ComponentFixture<CloseRateAutoTrackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CloseRateAutoTrackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloseRateAutoTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
