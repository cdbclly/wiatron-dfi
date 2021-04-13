import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsItemSpcComponent } from './forms-item-spc.component';

describe('FormsItemComponent', () => {
  let component: FormsItemSpcComponent;
  let fixture: ComponentFixture<FormsItemSpcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormsItemSpcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormsItemSpcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
