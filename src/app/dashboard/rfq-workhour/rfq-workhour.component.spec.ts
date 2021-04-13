import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RfqWorkhourComponent } from './rfq-workhour.component';

describe('RfqWorkhourComponent', () => {
  let component: RfqWorkhourComponent;
  let fixture: ComponentFixture<RfqWorkhourComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RfqWorkhourComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RfqWorkhourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
