import { TestBed } from '@angular/core/testing';

import { IkasleZerbitzuakService } from './ikasle-zerbitzuak.service';

describe('IkasleZerbitzuakService', () => {
  let service: IkasleZerbitzuakService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IkasleZerbitzuakService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
