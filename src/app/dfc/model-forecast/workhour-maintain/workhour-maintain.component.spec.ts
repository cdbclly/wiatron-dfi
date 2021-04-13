import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkhourMaintainComponent } from './workhour-maintain.component';

describe('WorkhourMaintainComponent', () => {
  let component: WorkhourMaintainComponent;
  let fixture: ComponentFixture<WorkhourMaintainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkhourMaintainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkhourMaintainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
