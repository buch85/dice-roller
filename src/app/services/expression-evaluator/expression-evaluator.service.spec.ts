import { TestBed } from '@angular/core/testing';

import { ExpressionEvaluatorService } from './expression-evaluator.service';

describe('ExpressionEvaulatorService', () => {
  let service: ExpressionEvaluatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpressionEvaluatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
