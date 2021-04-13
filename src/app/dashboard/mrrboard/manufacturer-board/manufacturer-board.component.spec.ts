import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufacturerBoardComponent } from './manufacturer-board.component';

describe('ManufacturerBoardComponent', () => {
  let component: ManufacturerBoardComponent;
  let fixture: ComponentFixture<ManufacturerBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManufacturerBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManufacturerBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
