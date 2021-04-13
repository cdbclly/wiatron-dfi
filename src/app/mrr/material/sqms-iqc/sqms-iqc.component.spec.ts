import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SqmsIqcComponent } from './sqms-iqc.component';

describe('SqmsIqcComponent', () => {
  let component: SqmsIqcComponent;
  let fixture: ComponentFixture<SqmsIqcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SqmsIqcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SqmsIqcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
