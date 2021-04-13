import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetHourSignComponent } from './target-hour-sign.component';

describe('TargetHourSignComponent', () => {
  let component: TargetHourSignComponent;
  let fixture: ComponentFixture<TargetHourSignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TargetHourSignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TargetHourSignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
