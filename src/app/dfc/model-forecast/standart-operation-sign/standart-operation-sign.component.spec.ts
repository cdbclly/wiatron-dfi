import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StandartOperationSignComponent } from './standart-operation-sign.component';

describe('StandartOperationSignComponent', () => {
  let component: StandartOperationSignComponent;
  let fixture: ComponentFixture<StandartOperationSignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StandartOperationSignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StandartOperationSignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
