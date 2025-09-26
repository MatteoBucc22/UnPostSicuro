import { TestBed } from '@angular/core/testing';

import { Specialist } from './specialist';

describe('Specialist', () => {
  let service: Specialist;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Specialist);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
