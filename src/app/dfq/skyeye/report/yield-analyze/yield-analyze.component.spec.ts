import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YieldAnalyzeComponent } from './yield-analyze.component';

describe('YieldAnalyzeComponent', () => {
  let component: YieldAnalyzeComponent;
  let fixture: ComponentFixture<YieldAnalyzeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YieldAnalyzeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YieldAnalyzeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
