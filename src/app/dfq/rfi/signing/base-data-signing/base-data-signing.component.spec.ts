import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseDataSigningComponent } from './base-data-signing.component';

describe('BaseDataSigningComponent', () => {
  let component: BaseDataSigningComponent;
  let fixture: ComponentFixture<BaseDataSigningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseDataSigningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseDataSigningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
