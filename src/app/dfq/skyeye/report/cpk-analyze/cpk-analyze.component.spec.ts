import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpkAnalyzeComponent } from './cpk-analyze.component';

describe('CpkAnalyzeComponent', () => {
  let component: CpkAnalyzeComponent;
  let fixture: ComponentFixture<CpkAnalyzeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpkAnalyzeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpkAnalyzeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
