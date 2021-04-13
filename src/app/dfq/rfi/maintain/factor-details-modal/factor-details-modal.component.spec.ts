import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FactorDetailsModalComponent } from './factor-details-modal.component';

describe('FactorDetailsModalComponent', () => {
  let component: FactorDetailsModalComponent;
  let fixture: ComponentFixture<FactorDetailsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FactorDetailsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FactorDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
