import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EchartsModalComponent } from './echarts-modal.component';

describe('EchartsModalComponent', () => {
  let component: EchartsModalComponent;
  let fixture: ComponentFixture<EchartsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EchartsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EchartsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
