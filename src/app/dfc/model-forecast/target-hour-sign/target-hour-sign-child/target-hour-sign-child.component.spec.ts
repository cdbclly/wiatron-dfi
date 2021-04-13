import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetHourSignChildComponent } from './target-hour-sign-child.component';

describe('TargetHourSignChildComponent', () => {
  let component: TargetHourSignChildComponent;
  let fixture: ComponentFixture<TargetHourSignChildComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TargetHourSignChildComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TargetHourSignChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
