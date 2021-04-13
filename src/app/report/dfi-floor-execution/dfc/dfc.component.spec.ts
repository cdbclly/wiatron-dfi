import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DfcComponent } from './dfc.component';

describe('DfcComponent', () => {
  let component: DfcComponent;
  let fixture: ComponentFixture<DfcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DfcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DfcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
