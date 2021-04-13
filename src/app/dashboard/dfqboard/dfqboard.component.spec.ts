import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DfqboardComponent } from './dfqboard.component';

describe('DfqboardComponent', () => {
  let component: DfqboardComponent;
  let fixture: ComponentFixture<DfqboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DfqboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DfqboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
