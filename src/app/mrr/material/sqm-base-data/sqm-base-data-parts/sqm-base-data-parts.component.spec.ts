import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SqmBaseDataPartsComponent } from './sqm-base-data-parts.component';

describe('SqmBaseDataPartsComponent', () => {
  let component: SqmBaseDataPartsComponent;
  let fixture: ComponentFixture<SqmBaseDataPartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SqmBaseDataPartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SqmBaseDataPartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
