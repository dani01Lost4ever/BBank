import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RicaricaTelefonoComponent } from './ricarica-telefono.component';

describe('RicaricaTelefonoComponent', () => {
  let component: RicaricaTelefonoComponent;
  let fixture: ComponentFixture<RicaricaTelefonoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RicaricaTelefonoComponent]
    });
    fixture = TestBed.createComponent(RicaricaTelefonoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
