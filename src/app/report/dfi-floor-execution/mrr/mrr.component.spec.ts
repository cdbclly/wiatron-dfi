import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MrrComponent } from './mrr.component';

describe('MrrComponent', () => {
  let component: MrrComponent;
  let fixture: ComponentFixture<MrrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MrrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MrrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
