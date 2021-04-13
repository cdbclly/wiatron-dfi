import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupAuthComponent } from './group-auth.component';

describe('GroupAuthComponent', () => {
  let component: GroupAuthComponent;
  let fixture: ComponentFixture<GroupAuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupAuthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
