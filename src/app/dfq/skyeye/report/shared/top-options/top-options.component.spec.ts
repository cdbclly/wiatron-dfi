import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopOptionsComponent } from './top-options.component';

describe('TopOptionsComponent', () => {
  let component: TopOptionsComponent;
  let fixture: ComponentFixture<TopOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
