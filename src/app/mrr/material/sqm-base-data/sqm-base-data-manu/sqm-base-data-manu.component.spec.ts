import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SqmBaseDataManuComponent } from './sqm-base-data-manu.component';

describe('SqmBaseDataManuComponent', () => {
  let component: SqmBaseDataManuComponent;
  let fixture: ComponentFixture<SqmBaseDataManuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SqmBaseDataManuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SqmBaseDataManuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
