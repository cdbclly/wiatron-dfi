import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignerHistoryComponent } from './signer-history.component';

describe('SignerHistoryComponent', () => {
  let component: SignerHistoryComponent;
  let fixture: ComponentFixture<SignerHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignerHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignerHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
