import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NuddBoardComponent } from './nudd-board.component';

describe('NuddBoardComponent', () => {
  let component: NuddBoardComponent;
  let fixture: ComponentFixture<NuddBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NuddBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NuddBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
