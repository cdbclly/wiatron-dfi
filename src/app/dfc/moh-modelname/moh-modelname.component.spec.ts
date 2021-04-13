import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MohModelnameComponent } from './moh-modelname.component';

describe('MohModelnameComponent', () => {
  let component: MohModelnameComponent;
  let fixture: ComponentFixture<MohModelnameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MohModelnameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MohModelnameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
