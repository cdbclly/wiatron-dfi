import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RewardsPunishmentRuleQueryComponent } from './rewards-punishment-rule-query.component';

describe('RewardsPunishmentRuleQueryComponent', () => {
  let component: RewardsPunishmentRuleQueryComponent;
  let fixture: ComponentFixture<RewardsPunishmentRuleQueryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RewardsPunishmentRuleQueryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RewardsPunishmentRuleQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
