import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { justLoggedGuard } from './just-logged.guard';

describe('justLoggedGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => justLoggedGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
