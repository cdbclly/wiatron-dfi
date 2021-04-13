import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrUpdateModelComponent } from './add-or-update-model.component';

describe('AddOrUpdateModelComponent', () => {
  let component: AddOrUpdateModelComponent;
  let fixture: ComponentFixture<AddOrUpdateModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOrUpdateModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOrUpdateModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
