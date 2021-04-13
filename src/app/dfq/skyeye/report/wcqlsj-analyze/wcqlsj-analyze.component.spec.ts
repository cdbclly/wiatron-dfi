import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WcqlsjAnalyzeComponent } from './wcqlsj-analyze.component';

describe('WcqlsjAnalyzeComponent', () => {
  let component: WcqlsjAnalyzeComponent;
  let fixture: ComponentFixture<WcqlsjAnalyzeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WcqlsjAnalyzeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WcqlsjAnalyzeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
