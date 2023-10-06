import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Movimenti1Component } from './movimenti1.component';

describe('Movimenti1Component', () => {
  let component: Movimenti1Component;
  let fixture: ComponentFixture<Movimenti1Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Movimenti1Component]
    });
    fixture = TestBed.createComponent(Movimenti1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
