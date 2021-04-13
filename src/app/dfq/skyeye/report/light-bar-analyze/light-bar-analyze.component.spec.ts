import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LightBarAnalyzeComponent } from './light-bar-analyze.component';

describe('LightBarAnalyzeComponent', () => {
  let component: LightBarAnalyzeComponent;
  let fixture: ComponentFixture<LightBarAnalyzeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LightBarAnalyzeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LightBarAnalyzeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
