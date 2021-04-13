import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YrBoardComponent } from './yr-board.component';

describe('YrBoardComponent', () => {
  let component: YrBoardComponent;
  let fixture: ComponentFixture<YrBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YrBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YrBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
