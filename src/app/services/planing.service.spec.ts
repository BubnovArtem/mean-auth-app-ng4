import { TestBed, inject } from '@angular/core/testing';

import { PlaningService } from './planing.service';

describe('PlaningService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlaningService]
    });
  });

  it('should be created', inject([PlaningService], (service: PlaningService) => {
    expect(service).toBeTruthy();
  }));
});
