import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DfcQueryInputComponent } from './dfc-query-input.component';

describe('DfcQueryInputComponent', () => {
  let component: DfcQueryInputComponent;
  let fixture: ComponentFixture<DfcQueryInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DfcQueryInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DfcQueryInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
