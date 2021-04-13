import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SqmBaseDataMatmComponent } from './sqm-base-data-matm.component';

describe('SqmBaseDataMatmComponent', () => {
  let component: SqmBaseDataMatmComponent;
  let fixture: ComponentFixture<SqmBaseDataMatmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SqmBaseDataMatmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SqmBaseDataMatmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
