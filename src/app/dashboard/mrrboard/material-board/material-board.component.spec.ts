import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialBoardComponent } from './material-board.component';

describe('MaterialBoardComponent', () => {
  let component: MaterialBoardComponent;
  let fixture: ComponentFixture<MaterialBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
