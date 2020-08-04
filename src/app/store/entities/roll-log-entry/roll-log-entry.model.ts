import {Expression} from '../../../services/expression-evaluator/expression-evaluator.service';

export interface RollLogEntry {
  id: number;
  result: Expression;
  dices: string;
  name?: string;
}
