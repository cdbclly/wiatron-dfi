import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FactoryDefectiveComponent } from './factory-defective.component';

describe('FactoryDefectiveComponent', () => {
  let component: FactoryDefectiveComponent;
  let fixture: ComponentFixture<FactoryDefectiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FactoryDefectiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FactoryDefectiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
