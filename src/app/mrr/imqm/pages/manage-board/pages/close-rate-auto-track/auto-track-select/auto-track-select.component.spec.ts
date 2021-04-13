import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoTrackSelectComponent } from './auto-track-select.component';

describe('AutoTrackSelectComponent', () => {
  let component: AutoTrackSelectComponent;
  let fixture: ComponentFixture<AutoTrackSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoTrackSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoTrackSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
