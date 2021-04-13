import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkhourQueryComponent } from './workhour-query.component';

describe('WorkhourQueryComponent', () => {
  let component: WorkhourQueryComponent;
  let fixture: ComponentFixture<WorkhourQueryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkhourQueryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkhourQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
