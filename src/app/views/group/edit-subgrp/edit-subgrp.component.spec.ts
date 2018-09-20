import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSubgrpComponent } from './edit-subgrp.component';

describe('EditSubgrpComponent', () => {
  let component: EditSubgrpComponent;
  let fixture: ComponentFixture<EditSubgrpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSubgrpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSubgrpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
