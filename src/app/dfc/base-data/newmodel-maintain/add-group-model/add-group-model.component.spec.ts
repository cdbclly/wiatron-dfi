import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGroupModelComponent } from './add-group-model.component';

describe('AddGroupModelComponent', () => {
  let component: AddGroupModelComponent;
  let fixture: ComponentFixture<AddGroupModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddGroupModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGroupModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
