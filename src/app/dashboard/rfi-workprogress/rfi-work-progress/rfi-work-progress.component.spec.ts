import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RfiWorkProgressComponent } from './rfi-work-progress.component';

describe('RfiWorkProgressComponent', () => {
  let component: RfiWorkProgressComponent;
  let fixture: ComponentFixture<RfiWorkProgressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RfiWorkProgressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RfiWorkProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
