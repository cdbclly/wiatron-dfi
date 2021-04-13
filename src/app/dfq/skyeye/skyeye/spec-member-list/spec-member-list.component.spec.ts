import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecMemberListComponent } from './spec-member-list.component';

describe('SpecMemberListComponent', () => {
  let component: SpecMemberListComponent;
  let fixture: ComponentFixture<SpecMemberListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecMemberListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecMemberListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
