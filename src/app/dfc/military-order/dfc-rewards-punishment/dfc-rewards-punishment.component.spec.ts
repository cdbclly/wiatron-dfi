import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DfcRewardsPunishmentComponent } from './dfc-rewards-punishment.component';

describe('DfcRewardsPunishmentComponent', () => {
  let component: DfcRewardsPunishmentComponent;
  let fixture: ComponentFixture<DfcRewardsPunishmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DfcRewardsPunishmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DfcRewardsPunishmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
