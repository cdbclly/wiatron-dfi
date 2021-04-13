import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdresultComponent } from './idresult.component';

describe('IdresultComponent', () => {
  let component: IdresultComponent;
  let fixture: ComponentFixture<IdresultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdresultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdresultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
