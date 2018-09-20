import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeviewComponent } from './nodeview.component';

describe('NodeviewComponent', () => {
  let component: NodeviewComponent;
  let fixture: ComponentFixture<NodeviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodeviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
