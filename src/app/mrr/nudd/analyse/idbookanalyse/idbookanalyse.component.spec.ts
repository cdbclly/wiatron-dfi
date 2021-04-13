import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdbookanalyseComponent } from './idbookanalyse.component';

describe('IdbookanalyseComponent', () => {
  let component: IdbookanalyseComponent;
  let fixture: ComponentFixture<IdbookanalyseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdbookanalyseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdbookanalyseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
