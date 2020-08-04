import {Component, OnDestroy} from '@angular/core';
import {createSelector, MemoizedSelector, Store} from '@ngrx/store';
import {State} from './store/app.reducers';
import {RollLogEntry} from './store/entities/roll-log-entry/roll-log-entry.model';
import {rollLogEntryEntityAdapter} from './store/entities/roll-log-entry/roll-log-entry.reducer';
import {filter} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  title = 'dice-bag';
  private lastRollSubscription: Subscription;

  constructor(private readonly store: Store<State>,
              private readonly snackBar: MatSnackBar,
              private readonly router: Router) {
    const lastRollSelector: MemoizedSelector<State, RollLogEntry> = createSelector(
      state => state.rollLogs,
      createSelector(rollLogEntryEntityAdapter.getSelectors().selectAll, r => [...r].pop())
    );
    this.lastRollSubscription = store.select(lastRollSelector).pipe(filter(value => value !== undefined)).subscribe((rollLogEntry) => {
      this.openSnackBar(rollLogEntry);
    });
  }

  openSnackBar(rollLogEntry: RollLogEntry): void {
    const matSnackBarRef = this.snackBar.open('You rolled ' + rollLogEntry.result.value, 'See details', {
      duration: 2000,
    });
    const subscription = matSnackBarRef.onAction().subscribe(() => {
      this.router.navigate(['roll-log'], {queryParams: {selected: rollLogEntry.id}});
      subscription.unsubscribe();
    });
  }

  ngOnDestroy(): void {
    this.lastRollSubscription.unsubscribe();
  }
}
