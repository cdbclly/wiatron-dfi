import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MrrboardComponent } from './mrrboard.component';

describe('MrrboardComponent', () => {
  let component: MrrboardComponent;
  let fixture: ComponentFixture<MrrboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MrrboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MrrboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
