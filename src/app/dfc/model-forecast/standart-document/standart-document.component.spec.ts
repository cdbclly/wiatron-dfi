import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StandartDocumentComponent } from './standart-document.component';

describe('StandartDocumentComponent', () => {
  let component: StandartDocumentComponent;
  let fixture: ComponentFixture<StandartDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StandartDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StandartDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
