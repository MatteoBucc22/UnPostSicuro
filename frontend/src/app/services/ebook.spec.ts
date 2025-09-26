import { TestBed } from '@angular/core/testing';

import { Ebook } from './ebook';

describe('Ebook', () => {
  let service: Ebook;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Ebook);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
