import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSubgrpComponent } from './view-subgrp.component';

describe('ViewSubgrpComponent', () => {
  let component: ViewSubgrpComponent;
  let fixture: ComponentFixture<ViewSubgrpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewSubgrpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSubgrpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
