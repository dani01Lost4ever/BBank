import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Movimenti23Component } from './movimenti23.component';

describe('Movimenti23Component', () => {
  let component: Movimenti23Component;
  let fixture: ComponentFixture<Movimenti23Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Movimenti23Component]
    });
    fixture = TestBed.createComponent(Movimenti23Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
