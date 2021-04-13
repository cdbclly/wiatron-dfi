import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NpiItemsTableComponent } from './npi-items-table.component';

describe('NpiItemsTableComponent', () => {
  let component: NpiItemsTableComponent;
  let fixture: ComponentFixture<NpiItemsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NpiItemsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NpiItemsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
