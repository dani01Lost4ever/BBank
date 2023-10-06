import { TestBed } from '@angular/core/testing';

import { ToastsMessagesService } from './toasts-messages.service';

describe('ToastsMessagesService', () => {
  let service: ToastsMessagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastsMessagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
