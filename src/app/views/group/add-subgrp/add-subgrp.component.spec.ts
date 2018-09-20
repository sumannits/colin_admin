import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSubgrpComponent } from './add-subgrp.component';

describe('AddSubgrpComponent', () => {
  let component: AddSubgrpComponent;
  let fixture: ComponentFixture<AddSubgrpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSubgrpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSubgrpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
