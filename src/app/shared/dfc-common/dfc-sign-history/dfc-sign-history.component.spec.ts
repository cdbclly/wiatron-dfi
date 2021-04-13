import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DfcSignHistoryComponent } from './dfc-sign-history.component';

describe('DfcSignHistoryComponent', () => {
  let component: DfcSignHistoryComponent;
  let fixture: ComponentFixture<DfcSignHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DfcSignHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DfcSignHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
