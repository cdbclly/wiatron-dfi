import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SqmBaseDataComponent } from './sqm-base-data.component';

describe('SqmBaseDataComponent', () => {
  let component: SqmBaseDataComponent;
  let fixture: ComponentFixture<SqmBaseDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SqmBaseDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SqmBaseDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
