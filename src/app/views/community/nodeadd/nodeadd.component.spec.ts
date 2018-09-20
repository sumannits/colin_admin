import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeaddComponent } from './nodeadd.component';

describe('NodeaddComponent', () => {
  let component: NodeaddComponent;
  let fixture: ComponentFixture<NodeaddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodeaddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
