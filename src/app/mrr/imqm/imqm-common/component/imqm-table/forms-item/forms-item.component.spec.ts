import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsItemComponent } from './forms-item.component';

describe('FormsItemComponent', () => {
  let component: FormsItemComponent;
  let fixture: ComponentFixture<FormsItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormsItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormsItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
