import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpcAnalyzeComponent } from './spc-analyze.component';

describe('SpcAnalyzeComponent', () => {
  let component: SpcAnalyzeComponent;
  let fixture: ComponentFixture<SpcAnalyzeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpcAnalyzeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpcAnalyzeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
