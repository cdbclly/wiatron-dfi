import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsRawDataComponent } from './forms-raw-data.component';

describe('FormsRawDataComponent', () => {
  let component: FormsRawDataComponent;
  let fixture: ComponentFixture<FormsRawDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormsRawDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormsRawDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
