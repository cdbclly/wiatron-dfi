import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentBoardComponent } from './document-board.component';

describe('DocumentBoardComponent', () => {
  let component: DocumentBoardComponent;
  let fixture: ComponentFixture<DocumentBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
