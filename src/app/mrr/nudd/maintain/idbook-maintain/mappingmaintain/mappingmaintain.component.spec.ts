import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MappingmaintainComponent } from './mappingmaintain.component';

describe('MappingmaintainComponent', () => {
  let component: MappingmaintainComponent;
  let fixture: ComponentFixture<MappingmaintainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MappingmaintainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MappingmaintainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
