import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetHoursComponent } from './target-hours.component';

describe('TargetHoursComponent', () => {
  let component: TargetHoursComponent;
  let fixture: ComponentFixture<TargetHoursComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TargetHoursComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TargetHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
