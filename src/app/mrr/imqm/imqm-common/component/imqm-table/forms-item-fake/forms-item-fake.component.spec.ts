import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsItemFakeComponent } from './forms-item-fake.component';

describe('FormsItemFakeComponent', () => {
  let component: FormsItemFakeComponent;
  let fixture: ComponentFixture<FormsItemFakeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormsItemFakeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormsItemFakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
