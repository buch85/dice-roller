import {MatSelectChange} from '@angular/material/select';
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {ExpressionEvaluatorService} from '../../services/expression-evaluator/expression-evaluator.service';
import {DiceChip, ModifierOption, ModifierPart} from './dice-chip';
import {TextChip} from './text-chip';
import {Store} from '@ngrx/store';
import {State} from '../../store/app.reducers';
import {roll, saveFavorite, setCurrentExpression} from '../../store/app.actions';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {SaveDicesDialogComponent} from '../save-dices-dialog/save-dices-dialog.component';

export declare type Chip = DiceChip | TextChip;

@Component({
  selector: 'app-dices',
  templateUrl: './dices.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./dices.component.scss']
})
export class DicesComponent implements OnInit {

  rollExpression$: Observable<string>;
  lastRollSubscription: Subscription;

  diceButtons: string[] = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'];
  operationButtons: string[] = ['+', '-', '*', '/'];

  numberButtons: number[] = [1, 5, 10];
  count = 1;
  chips: Chip[] = [];
  selectedChip: DiceChip;

  constructor(private readonly store: Store<State>,
              private readonly snackBar: MatSnackBar,
              private readonly changeDetectorRef: ChangeDetectorRef,
              private readonly evaluatorService: ExpressionEvaluatorService,
              public dialog: MatDialog) {
    this.rollExpression$ = store.select(state => state.currentExpression);
  }


  ngOnInit(): void {
  }

  expressionChanged(value: string): void {
    this.chips = this.evaluatorService.computeChips(value);
    this.recomputeExpressionFromChips();
  }


  onDiceButton(diceButton: string): void {
    const sides = parseInt(diceButton.substr(1), 10);
    if (!this.selectedChip) {
      const lastChip = this.chips[this.chips.length - 1];
      if (lastChip && !(this.operationButtons.indexOf(lastChip.getText()) !== -1)) {
        this.chips.push(new TextChip('+'));
      }
      const diceChip = new DiceChip(1, sides);
      this.chips.push(diceChip);
      this.selectedChip = diceChip;
    } else {
      if (this.selectedChip.sides !== sides) {
        this.selectedChip.setSides(sides);
      } else {
        this.selectedChip.count++;
      }
    }
    this.recomputeExpressionFromChips();
  }

  increaseCount(): void {
    this.selectedChip.count++;
    this.recomputeExpressionFromChips();
  }

  recomputeExpressionFromChips(): void {
    this.store.dispatch(setCurrentExpression({
      expression: this.chips
        .map(value => value.getText())
        .reduce((previousValue, currentValue) => previousValue + currentValue)
    }));
  }

  decreaseCount(): void {
    if (this.selectedChip.count > 1) {
      this.selectedChip.count--;
      this.recomputeExpressionFromChips();
    }
  }

  isSelected(chip: DiceChip): boolean {
    return this.selectedChip === chip;
  }

  toggleSelection(chip: DiceChip): void {
    if (this.isSelected(chip)) {
      this.removeSelection();
    } else {
      this.select(chip);
    }
  }

  private select(chip: DiceChip): void {
    this.selectedChip = chip;
    setTimeout(() => {
      this.changeDetectorRef.detectChanges();
    });
  }

  private removeSelection(): void {
    this.selectedChip = undefined;
    setTimeout(() => {
      this.changeDetectorRef.detectChanges();
    });
  }

  onOperationButton(operationButton: string): void {
    const lastChip = this.chips[this.chips.length - 1];
    if (lastChip && !(this.operationButtons.indexOf(lastChip.getText()) !== -1)) {
      this.removeSelection();
      this.chips.push(new TextChip(operationButton));
      this.recomputeExpressionFromChips();
    }
  }

  onNumberButton(numberButton: number): void {
    const lastChip = this.chips[this.chips.length - 1];
    if (lastChip) {
      const text = lastChip.getText();
      if (text.match(/^\d+$/)) {
        this.chips.pop();
        const num = parseInt(text, 10) + numberButton;
        this.chips.push(new TextChip(num));
      } else if (this.operationButtons.indexOf(text) === -1) {
        this.chips.push(new TextChip('+'));
        this.chips.push(new TextChip(numberButton));
      } else {
        this.chips.push(new TextChip(numberButton));
      }
    } else {
      this.chips.push(new TextChip(numberButton));
    }
    this.recomputeExpressionFromChips();
  }


  modifierSelectionChanged($event: MatSelectChange): void {
    console.log($event);
    this.selectedChip.modifierSelected($event.value);
    this.recomputeExpressionFromChips();
  }

  setSelectedChipModifierPart(selectedOption: ModifierOption, modPart: ModifierPart, value: any): void {
    this.selectedChip.setModifierPart(selectedOption, modPart, value);
    this.recomputeExpressionFromChips();

  }

  roll(expression: string): void {
    this.store.dispatch(roll({expression}));
  }

  save(expression: string): void {
    const dialogRef = this.dialog.open(SaveDicesDialogComponent, {
      width: '250px',
      data: {name: '',  expression}
    });

    const subscription = dialogRef.afterClosed().subscribe(name => {
      if (name) {
        this.store.dispatch(saveFavorite({name, expression}));
      }
      subscription.unsubscribe();
    });
  }
}
