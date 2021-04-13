import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationGuideComponent } from './operation-guide.component';

describe('OperationGuideComponent', () => {
  let component: OperationGuideComponent;
  let fixture: ComponentFixture<OperationGuideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationGuideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
