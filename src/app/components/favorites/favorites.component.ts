import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {createSelector, Store} from '@ngrx/store';
import {State} from '../../store/app.reducers';
import {ActivatedRoute} from '@angular/router';
import {RollConfiguration} from '../../store/entities/roll-configuration/roll-configuration.model';
import {rollConfigurationEntityAdapter} from '../../store/entities/roll-configuration/roll-configuration.reducer';
import {roll} from '../../store/app.actions';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {
  public rollConfigurations$: Observable<RollConfiguration[]>;
  public selectedId: number;

  constructor(private store: Store<State>, private route: ActivatedRoute) {
    this.rollConfigurations$ = store.select(createSelector(state => state.rollConfigurations, rollConfigurationEntityAdapter.getSelectors().selectAll));
  }

  ngOnInit(): void {
    if (this.route.snapshot.queryParamMap.has('selected')) {
      this.selectedId = parseInt(this.route.snapshot.queryParamMap.get('selected'), 10);
    }
  }

  roll(rollConfiguration: RollConfiguration): void {
    this.store.dispatch(roll({...rollConfiguration}));
  }
}
