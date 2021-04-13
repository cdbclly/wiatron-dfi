import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DfcboardComponent } from './dfcboard.component';

describe('DfcboardComponent', () => {
  let component: DfcboardComponent;
  let fixture: ComponentFixture<DfcboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DfcboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DfcboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
