import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeeditComponent } from './nodeedit.component';

describe('NodeeditComponent', () => {
  let component: NodeeditComponent;
  let fixture: ComponentFixture<NodeeditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodeeditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
