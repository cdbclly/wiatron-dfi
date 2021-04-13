import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsItemCpkComponent } from './forms-item-cpk.component';

describe('FormsItemCpkComponent', () => {
  let component: FormsItemCpkComponent;
  let fixture: ComponentFixture<FormsItemCpkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormsItemCpkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormsItemCpkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
