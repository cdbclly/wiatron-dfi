import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CriterionQueryComponent } from './criterion-query.component';

describe('CriterionQueryComponent', () => {
  let component: CriterionQueryComponent;
  let fixture: ComponentFixture<CriterionQueryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CriterionQueryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CriterionQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
