import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StandartOperationSignDetailComponent } from './standart-operation-sign-detail.component';

describe('StandartOperationSignDetailComponent', () => {
  let component: StandartOperationSignDetailComponent;
  let fixture: ComponentFixture<StandartOperationSignDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StandartOperationSignDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StandartOperationSignDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
