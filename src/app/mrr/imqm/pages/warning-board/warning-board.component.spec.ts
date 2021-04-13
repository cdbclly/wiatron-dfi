import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarningBoardComponent } from './warning-board.component';

describe('WarningBoardComponent', () => {
  let component: WarningBoardComponent;
  let fixture: ComponentFixture<WarningBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarningBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarningBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
