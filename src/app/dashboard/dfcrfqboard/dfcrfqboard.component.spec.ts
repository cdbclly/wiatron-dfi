import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DfcrfqboardComponent } from './dfcrfqboard.component';

describe('DfcrfqboardComponent', () => {
  let component: DfcrfqboardComponent;
  let fixture: ComponentFixture<DfcrfqboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DfcrfqboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DfcrfqboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
