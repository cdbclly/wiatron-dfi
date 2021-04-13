import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestTimeAnalyzeComponent } from './test-time-analyze.component';

describe('TestTimeAnalyzeComponent', () => {
  let component: TestTimeAnalyzeComponent;
  let fixture: ComponentFixture<TestTimeAnalyzeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestTimeAnalyzeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestTimeAnalyzeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
