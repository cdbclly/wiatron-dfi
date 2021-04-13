import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MrrDocAuthComponent } from './mrr-doc-auth.component';

describe('MrrDocAuthComponent', () => {
  let component: MrrDocAuthComponent;
  let fixture: ComponentFixture<MrrDocAuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MrrDocAuthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MrrDocAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
