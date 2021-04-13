import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssemblyDefecRateComponent } from './assembly-defec-rate.component';

describe('AssemblyDefecRateComponent', () => {
  let component: AssemblyDefecRateComponent;
  let fixture: ComponentFixture<AssemblyDefecRateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssemblyDefecRateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssemblyDefecRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
