import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllcustomerComponent } from './allcustomer.component';

describe('AllcustomerComponent', () => {
  let component: AllcustomerComponent;
  let fixture: ComponentFixture<AllcustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllcustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllcustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
