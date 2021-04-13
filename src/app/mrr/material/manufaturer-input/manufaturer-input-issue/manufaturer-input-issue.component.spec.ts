import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufaturerInputIssueComponent } from './manufaturer-input-issue.component';

describe('ManufaturerInputIssueComponent', () => {
  let component: ManufaturerInputIssueComponent;
  let fixture: ComponentFixture<ManufaturerInputIssueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManufaturerInputIssueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManufaturerInputIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
