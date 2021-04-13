import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JudgementComponentComponent } from './judgement-component.component';

describe('JudgementComponentComponent', () => {
  let component: JudgementComponentComponent;
  let fixture: ComponentFixture<JudgementComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JudgementComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JudgementComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
