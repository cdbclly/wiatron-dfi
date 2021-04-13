import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MrrDocViewComponent } from './mrr-doc-view.component';

describe('MrrDocViewComponent', () => {
  let component: MrrDocViewComponent;
  let fixture: ComponentFixture<MrrDocViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MrrDocViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MrrDocViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
