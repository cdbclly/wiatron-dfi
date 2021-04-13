import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DfcLoadingComponent } from './dfc-loading.component';

describe('DfcLoadingComponent', () => {
  let component: DfcLoadingComponent;
  let fixture: ComponentFixture<DfcLoadingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DfcLoadingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DfcLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
