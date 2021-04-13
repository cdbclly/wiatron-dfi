import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DfqComponent } from './dfq.component';

describe('DfqComponent', () => {
  let component: DfqComponent;
  let fixture: ComponentFixture<DfqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DfqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DfqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
