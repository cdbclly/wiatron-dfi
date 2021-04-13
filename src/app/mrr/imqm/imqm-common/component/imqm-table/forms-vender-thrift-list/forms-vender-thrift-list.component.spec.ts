import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsVenderThriftListComponent } from './forms-vender-thrift-list.component';

describe('FormsVenderThriftListComponent', () => {
  let component: FormsVenderThriftListComponent;
  let fixture: ComponentFixture<FormsVenderThriftListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormsVenderThriftListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormsVenderThriftListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
