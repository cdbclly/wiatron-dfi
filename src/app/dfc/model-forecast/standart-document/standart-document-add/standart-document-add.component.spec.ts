import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StandartDocumentAddComponent } from './standart-document-add.component';

describe('StandartDocumentAddComponent', () => {
  let component: StandartDocumentAddComponent;
  let fixture: ComponentFixture<StandartDocumentAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StandartDocumentAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StandartDocumentAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
