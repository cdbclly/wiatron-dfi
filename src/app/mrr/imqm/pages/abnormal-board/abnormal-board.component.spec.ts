import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbnormalBoardComponent } from './abnormal-board.component';

describe('AbnormalBoardComponent', () => {
  let component: AbnormalBoardComponent;
  let fixture: ComponentFixture<AbnormalBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbnormalBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbnormalBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
