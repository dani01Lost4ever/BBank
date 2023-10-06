import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransazioniGeneraliComponent } from './transazioni-generali.component';

describe('TransazioniGeneraliComponent', () => {
  let component: TransazioniGeneraliComponent;
  let fixture: ComponentFixture<TransazioniGeneraliComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TransazioniGeneraliComponent]
    });
    fixture = TestBed.createComponent(TransazioniGeneraliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
