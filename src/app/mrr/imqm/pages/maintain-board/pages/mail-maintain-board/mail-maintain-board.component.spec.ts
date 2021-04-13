import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailMaintainBoardComponent } from './mail-maintain-board.component';

describe('MailMaintainBoardComponent', () => {
  let component: MailMaintainBoardComponent;
  let fixture: ComponentFixture<MailMaintainBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailMaintainBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailMaintainBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
