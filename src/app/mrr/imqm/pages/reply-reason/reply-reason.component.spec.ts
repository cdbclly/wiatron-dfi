import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplyReasonComponent } from './reply-reason.component';

describe('ReplyReasonComponent', () => {
  let component: ReplyReasonComponent;
  let fixture: ComponentFixture<ReplyReasonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReplyReasonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplyReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
