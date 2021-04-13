import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecklistmodalComponent } from './checklistmodal.component';

describe('ChecklistmodalComponent', () => {
  let component: ChecklistmodalComponent;
  let fixture: ComponentFixture<ChecklistmodalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChecklistmodalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChecklistmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
