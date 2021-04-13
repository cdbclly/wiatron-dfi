import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CriterionMaintainComponent } from './criterion-maintain.component';

describe('CriterionMaintainComponent', () => {
  let component: CriterionMaintainComponent;
  let fixture: ComponentFixture<CriterionMaintainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CriterionMaintainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CriterionMaintainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
