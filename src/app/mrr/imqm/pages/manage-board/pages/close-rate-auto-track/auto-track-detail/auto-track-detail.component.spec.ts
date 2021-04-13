import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoTrackDetailComponent } from './auto-track-detail.component';

describe('AutoTrackDetailComponent', () => {
  let component: AutoTrackDetailComponent;
  let fixture: ComponentFixture<AutoTrackDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoTrackDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoTrackDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
