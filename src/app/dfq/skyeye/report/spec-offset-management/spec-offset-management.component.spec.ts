import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecOffsetManagementComponent } from './spec-offset-management.component';

describe('SpecOffsetManagementComponent', () => {
  let component: SpecOffsetManagementComponent;
  let fixture: ComponentFixture<SpecOffsetManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecOffsetManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecOffsetManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
