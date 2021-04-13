import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YrDpmLinkComponent } from './yr-dpm-link.component';

describe('YrDpmLinkComponent', () => {
  let component: YrDpmLinkComponent;
  let fixture: ComponentFixture<YrDpmLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YrDpmLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YrDpmLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
