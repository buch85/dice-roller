import {Injectable} from '@angular/core';
import {Chip} from '../../components/dices/dices.component';
import {TextChip} from '../../components/dices/text-chip';
import {DiceChip} from '../../components/dices/dice-chip';

@Injectable({
  providedIn: 'root'
})
export class ExpressionEvaluatorService {

  private expressionEvaluator = new ExpressionEvaluator();

  constructor() {
  }

  roll(expression: string): Expression {
    const tokens = this.expressionEvaluator.tokenize(expression);
    const rpn = this.expressionEvaluator.convertToRPN(tokens);
    return this.expressionEvaluator.calculateTree(rpn);
  }

  computeChips(value: string): Chip[] {
    const tokenize = this.expressionEvaluator.tokenize(value);
    const rpn = this.expressionEvaluator.convertToRPN(tokenize);
    const expression = this.expressionEvaluator.calculateTree(rpn, false);
    const chips = [];
    this.explodeExpression(expression, chips);
    return chips;
  }

  private explodeExpression(expression: Expression, chips: Chip[]): void {
    if (expression.type === 'o') {
      if (expression.group) {
        chips.push(new TextChip('('));
      }
      this.explodeExpression(expression.args[0], chips);
      chips.push(new TextChip(expression.operation));
      this.explodeExpression(expression.args[1], chips);
      if (expression.group) {
        chips.push(new TextChip(')'));
      }
    } else if (expression.type === 'd') {
      chips.push(new DiceChip(expression.count, expression.sides, expression.modifier));
    } else {
      chips.push(new TextChip(expression.value));
    }
  }
}

export class Token {
  value?: any;
  type: string;
  group?: boolean;
}


export enum TokenizerStates {
  Started = 1,
  ParsingNumber = 2,
  ParsingFunction = 3,
  Finished = 4,
  ParsingContext = 5,
  Error = 6,
  ParsingBracket = 7,
  ParsingModifier = 8
}

enum KnownStringComponents {
  Delimiter = 1,
  Digit = 2,
  Bracket = 3,
  Other = 4,
  ContextBracket = 5,
  DiceModifierBracket = 6,
}

const tokenStateMachine: any = {};
tokenStateMachine[TokenizerStates.Started] = {
  1: TokenizerStates.Started,
  2: TokenizerStates.ParsingNumber,
  3: TokenizerStates.ParsingBracket,
  4: TokenizerStates.ParsingFunction,
  5: TokenizerStates.ParsingContext,
  6: TokenizerStates.ParsingModifier
};
tokenStateMachine[TokenizerStates.ParsingNumber] = {
  1: TokenizerStates.Finished,
  2: TokenizerStates.ParsingNumber,
  3: TokenizerStates.Finished,
  4: TokenizerStates.Finished,
  5: TokenizerStates.Error,
  6: TokenizerStates.Error,
};
tokenStateMachine[TokenizerStates.ParsingFunction] = {
  1: TokenizerStates.Finished,
  2: TokenizerStates.ParsingFunction,
  3: TokenizerStates.Finished,
  4: TokenizerStates.ParsingFunction,
  5: TokenizerStates.Error,
  6: TokenizerStates.Error
};
tokenStateMachine[TokenizerStates.ParsingBracket] = {
  1: TokenizerStates.Finished,
  2: TokenizerStates.Finished,
  3: TokenizerStates.Finished,
  4: TokenizerStates.Finished,
  5: TokenizerStates.Finished,
  6: TokenizerStates.Finished
};
tokenStateMachine[TokenizerStates.ParsingContext] = {
  1: TokenizerStates.Finished,
  2: TokenizerStates.ParsingContext,
  3: TokenizerStates.Finished,
  4: TokenizerStates.ParsingContext,
  5: TokenizerStates.Finished,
  6: TokenizerStates.Finished
};
tokenStateMachine[TokenizerStates.ParsingModifier] = {
  1: TokenizerStates.Finished,
  2: TokenizerStates.ParsingModifier,
  3: TokenizerStates.Finished,
  4: TokenizerStates.ParsingModifier,
  5: TokenizerStates.Finished,
  6: TokenizerStates.Finished
};
declare  type TokenCandidate = {
  pos: number;
  tokenString: string;
  workingState: TokenizerStates
};
export declare type  DiceRoll = SimpleDiceRoll | BestWorstDiceRoll | WhiteWolfDiceRoll;

export interface SimpleDiceRoll {
  value: number;
}

export interface BestWorstDiceRoll {
  value: number;
  best: number;
  worst: number;
}

export interface WhiteWolfDiceRoll {
  value: number;
  rolled: number;
  explosion?: number;
  target: number;
}

export function rollDices(count: number, sides: number, modifier?: string): DiceRoll[] {
  const dices = [];

  for (let i = 0; i < count; i++) {
    if (modifier === undefined) {
      const value = Math.floor(Math.random() * sides) + 1;
      dices.push({value});
    } else if (modifier === 'adv' || modifier === 'dis') {
      const roll1 = Math.floor(Math.random() * sides) + 1;
      const roll2 = Math.floor(Math.random() * sides) + 1;
      const best = Math.max(roll1, roll2);
      const worst = Math.min(roll1, roll2);
      dices.push({value: modifier === 'adv' ? best : worst, best, worst});
    } else if (modifier.startsWith('s')) {
      const matcher = /s(?<target>\d+)(?:e(?<explode>\d+))?/ig;
      const regExpMatchArray = matcher.exec(modifier);
      const targetString = regExpMatchArray.groups.target;
      const target = parseInt(targetString, 10);
      const explodeString = regExpMatchArray.groups.explode;
      const rolled = Math.floor(Math.random() * sides) + 1;
      let explosion;
      let value = rolled >= target ? 1 : 0;
      if (explodeString !== undefined && rolled >= parseInt(explodeString, 10)) {
        explosion = Math.floor(Math.random() * sides) + 1;
        value += explosion >= target ? 1 : 0;
      }
      dices.push({rolled, value, explosion, target});
    }
  }
  return dices;
}

export class ExpressionEvaluator {


  constructor(context: any = {}) {
    this.context = context;
  }

  static operations = {
    '+': {
      priority: 0,
      function: (a, b) => a + b
    },
    '-': {
      priority: 0,
      function: (a, b) => a - b
    },
    '*': {
      priority: 1,
      function: (a, b) => a * b
    },
    '/': {
      priority: 1,
      function: (a, b) => a / b
    },
    '%': {
      priority: 1,
      function: (a, b) => a % b
    },
    $$getContextValue: {
      priority: 100,
      function: (propertyName: string, context: any) => {
        return context[propertyName];
      }
    },
    d: {
      priority: 100
    }
  };
  private static digits = '0123456789.';
  private static brackets = '()';
  private static contextBrackets = '{}';
  private static diceModifierBrackets = '[]';
  private static delimeters = ' ,\r\r\n';

  private readonly context;


  private static rollExpression(roll: boolean, item: Token, count: number, sides: number, modifier): Expression {
    let diceRolls: DiceRoll[];
    let value: number;
    if (roll) {
      diceRolls = rollDices(count, sides, modifier);
      value = diceRolls.reduce((sum, current) => sum + current.value, 0);
    }
    return {type: 'd', dices: diceRolls, count, sides, value, modifier, group: item.group};
  }

  private isOfMoreOrEqualPriority(currentOp: string, otherOp: string): boolean {
    return (
      ExpressionEvaluator.operations[currentOp].priority <=
      ExpressionEvaluator.operations[otherOp].priority
    );
  }

  classifySymbol(symbol: string): KnownStringComponents {
    if (ExpressionEvaluator.delimeters.indexOf(symbol) !== -1) {
      return KnownStringComponents.Delimiter;
    } else if (ExpressionEvaluator.brackets.indexOf(symbol) !== -1) {
      return KnownStringComponents.Bracket;
    } else if (ExpressionEvaluator.digits.indexOf(symbol) !== -1) {
      return KnownStringComponents.Digit;
    } else if (ExpressionEvaluator.contextBrackets.indexOf(symbol) !== -1) {
      return KnownStringComponents.ContextBracket;
    } else if (ExpressionEvaluator.diceModifierBrackets.indexOf(symbol) !== -1) {
      return KnownStringComponents.DiceModifierBracket;
    }
    return KnownStringComponents.Other;
  }

  scanToken(str: string, start: number): TokenCandidate {
    let state: TokenizerStates = TokenizerStates.Started;
    let workingState = TokenizerStates.Error;
    let tokenString = '';
    let i = start;
    while (i < str.length && (state !== TokenizerStates.Finished && state !== TokenizerStates.Error)) {
      const prevState = state;
      const symbolClass = this.classifySymbol(str[i]);
      state = tokenStateMachine[state][symbolClass];
      if (state === TokenizerStates.ParsingFunction && ExpressionEvaluator.operations[tokenString] !== undefined) {
        state = TokenizerStates.Finished;
      }

      if (prevState !== state) {
        if (state === TokenizerStates.ParsingContext || prevState === TokenizerStates.ParsingContext) {
          i++;
        } else if (state === TokenizerStates.ParsingModifier || prevState === TokenizerStates.ParsingModifier) {
          i++;
        }
      }

      if (state === TokenizerStates.ParsingFunction
        || state === TokenizerStates.ParsingNumber
        || state === TokenizerStates.ParsingBracket
        || state === TokenizerStates.ParsingContext
        || state === TokenizerStates.ParsingModifier) {
        workingState = state;
        tokenString += str[i++];
      } else if (state === TokenizerStates.Started) {
        i++;
      }
    }
    if (tokenString === '') {
      workingState = TokenizerStates.Error;
    }
    return {workingState, tokenString, pos: i};
  }

  tokenize(expression: string): Array<Token> {
    const tokens: Array<Token> = [];
    for (let i = 0; i < expression.length;) {
      const tokenCandidate = this.scanToken(expression, i);
      if (tokenCandidate.workingState !== TokenizerStates.Error) {
        if (tokenCandidate.workingState === TokenizerStates.ParsingNumber) {
          tokens.push({
            type: 'n', value: tokenCandidate.tokenString.indexOf('.') !== -1
              ? parseFloat(tokenCandidate.tokenString)
              : parseInt(tokenCandidate.tokenString, 10)
          });
        } else if (tokenCandidate.workingState === TokenizerStates.ParsingContext) {
          tokens.push({type: '$$getContextValue'});
          tokens.push({type: 'n', value: tokenCandidate.tokenString as any});
          tokens.push({type: 'n', value: this.context});
        } else if (tokenCandidate.workingState === TokenizerStates.ParsingModifier) {
          tokens.push({type: 'diceMod', value: tokenCandidate.tokenString as any});
        } else {
          tokens.push({type: tokenCandidate.tokenString});
        }
      }
      i = tokenCandidate.pos;
    }
    return tokens;
  }

  convertToRPN(tokens: Array<Token>): Array<Token> {
    const stack: Array<Token> = [];
    const rpn: Array<Token> = [];
    let currToken;

    let j = 0;
    for (const item of tokens) {
      if (item.type === 'n' || item.type === 'diceMod') {
        rpn[j++] = item;
        continue;
      }
      if (item.type === '(') {
        stack.push(item);
        continue;
      }
      if (item.type === ')') {
        do {
          if (stack.length === 0) {
            throw new Error('Invalid expression');
          }
          currToken = stack.pop();
          rpn[j++] = {...currToken, group: true};
        } while (rpn[j - 1].type !== '(');
        j--;
        continue;
      }
      if (Object.keys(ExpressionEvaluator.operations).indexOf(item.type) !== -1) {
        if (stack.length > 0) {
          do {
            currToken = stack.pop();
            rpn[j++] = currToken;
          } while (
            stack.length > 0 &&
            ExpressionEvaluator.brackets.indexOf(rpn[j - 1].type) === -1 &&
            this.isOfMoreOrEqualPriority(item.type, rpn[j - 1].type)
            );
          if (
            ExpressionEvaluator.brackets.indexOf(rpn[j - 1].type) !== -1 ||
            !this.isOfMoreOrEqualPriority(item.type, rpn[j - 1].type)
          ) {
            stack.push(currToken);
            j--;
          }
        }
        stack.push(item);
      }
    }
    while (stack.length > 0) {
      currToken = stack.pop();
      rpn[j++] = currToken;
    }
    return rpn;
  }


  calculateTree(rpn: Array<Token>, evaluate: boolean = true): Expression {
    const operands: Array<Expression> = [];

    if (rpn.length === 0) {
      return undefined;
    }

    for (const item of rpn) {
      if (item.type === 'n') {
        operands.push({type: 'l', value: item.value, group: item.group});
      } else if (item.type === 'diceMod') {
        operands.push({type: 'diceMod', value: item.value, group: item.group});
      } else {
        if (item.type === 'd') {
          const length = operands.length;
          if (length > 2 && operands[length - 1].type === 'diceMod') {
            const funcParams = 3;
            if (length < funcParams) {
              throw new Error('Invalid expression');
            }
            const args = operands.splice(length - funcParams);
            operands.push(ExpressionEvaluator.rollExpression(evaluate, item, args[0].value, args[1].value, args[2].value));
          } else {
            const funcParams = 2;
            if (length < funcParams) {
              throw new Error('Invalid expression');
            }
            const args = operands.splice(length - funcParams);
            operands.push(ExpressionEvaluator.rollExpression(evaluate, item, args[0].value, args[1].value, undefined));
          }
        } else {
          const func = ExpressionEvaluator.operations[item.type].function;
          const length = operands.length;
          const funcParams = func.length;
          if (length < funcParams) {
            throw new Error('Invalid expression');
          }
          const args = operands.splice(length - funcParams);
          const value = evaluate ? func(...args.map(arg => arg.value)) : undefined;
          operands.push({type: 'o', operation: item.type, args, value, group: item.group});
        }
      }
    }
    return operands.shift();
  }
}

export declare type Expression = Literal | Operation | DicePool | DiceMod;

export interface Literal {
  type: 'l';
  group?: boolean;
  value: number;
}

export interface Operation {
  type: 'o';
  group?: boolean;
  operation: string;
  args: Expression[];
  value: any;
}

export interface DiceMod {
  type: 'diceMod';
  group?: boolean;
  value: string;
}

export interface DicePool {
  type: 'd';
  group?: boolean;
  count: number;
  sides: number;
  modifier?: string;
  dices: DiceRoll[];
  value: any;
}
