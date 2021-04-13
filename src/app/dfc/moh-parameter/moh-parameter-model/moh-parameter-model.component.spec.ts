import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MohParameterModelComponent } from './moh-parameter-model.component';

describe('MohParameterModelComponent', () => {
  let component: MohParameterModelComponent;
  let fixture: ComponentFixture<MohParameterModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MohParameterModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MohParameterModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
