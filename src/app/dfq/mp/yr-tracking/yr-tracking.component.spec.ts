import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YrTrackingComponent } from './yr-tracking.component';

describe('YrTrackingComponent', () => {
  let component: YrTrackingComponent;
  let fixture: ComponentFixture<YrTrackingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YrTrackingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YrTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
