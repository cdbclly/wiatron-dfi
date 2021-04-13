import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkyeyeBoardComponent } from './skyeye-board.component';

describe('SkyeyeBoardComponent', () => {
  let component: SkyeyeBoardComponent;
  let fixture: ComponentFixture<SkyeyeBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkyeyeBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkyeyeBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
