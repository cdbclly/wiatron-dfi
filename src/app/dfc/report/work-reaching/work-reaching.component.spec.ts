import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkReachingComponent } from './work-reaching.component';

describe('WorkReachingComponent', () => {
  let component: WorkReachingComponent;
  let fixture: ComponentFixture<WorkReachingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkReachingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkReachingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
