import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FactoryDefectiveIssueComponent } from './factory-defective-issue.component';

describe('FactoryDefectiveIssueComponent', () => {
  let component: FactoryDefectiveIssueComponent;
  let fixture: ComponentFixture<FactoryDefectiveIssueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FactoryDefectiveIssueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FactoryDefectiveIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
