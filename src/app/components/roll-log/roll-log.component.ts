import {Component, OnInit} from '@angular/core';
import {State} from '../../store/app.reducers';
import {createSelector, Store} from '@ngrx/store';
import {rollLogEntryEntityAdapter} from '../../store/entities/roll-log-entry/roll-log-entry.reducer';
import {Observable} from 'rxjs';
import {RollLogEntry} from '../../store/entities/roll-log-entry/roll-log-entry.model';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-roll-log',
  templateUrl: './roll-log.component.html',
  styleUrls: ['./roll-log.component.scss']
})
export class RollLogComponent implements OnInit {
  public rollLogs$: Observable<RollLogEntry[]>;
  public selectedId: number;

  constructor(private store: Store<State>, private route: ActivatedRoute) {
    this.rollLogs$ = store.select(createSelector(state => state.rollLogs, rollLogEntryEntityAdapter.getSelectors().selectAll));
  }

  ngOnInit(): void {
    if (this.route.snapshot.queryParamMap.has('selected')) {
      this.selectedId = parseInt(this.route.snapshot.queryParamMap.get('selected'), 10);
    }
  }

}
