import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkhourValidationComponent } from './workhour-validation.component';

describe('WorkhourValidationComponent', () => {
  let component: WorkhourValidationComponent;
  let fixture: ComponentFixture<WorkhourValidationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkhourValidationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkhourValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
