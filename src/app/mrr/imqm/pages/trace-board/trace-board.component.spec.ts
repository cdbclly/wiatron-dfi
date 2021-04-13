import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TraceBoardComponent } from './trace-board.component';

describe('TraceBoardComponent', () => {
  let component: TraceBoardComponent;
  let fixture: ComponentFixture<TraceBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TraceBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TraceBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
