import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {StoreModule} from '@ngrx/store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {environment} from '../environments/environment';
import {EffectsModule} from '@ngrx/effects';
import {AppEffects} from './store/app.effects';
import {DiceBagNavigationComponent} from './components/dice-bag-navigation/dice-bag-navigation.component';
import {DicesComponent} from './components/dices/dices.component';
import {FavoritesComponent} from './components/favorites/favorites.component';
import {RollLogComponent} from './components/roll-log/roll-log.component';
import {metaReducers, reducers} from './store/app.reducers';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatOptionModule} from '@angular/material/core';
import {MatTabsModule} from '@angular/material/tabs';
import {ServiceWorkerModule} from '@angular/service-worker';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {RouterModule, Routes} from '@angular/router';
import {SaveDicesDialogComponent} from './components/save-dices-dialog/save-dices-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import {A11yModule, CdkTrapFocus} from '@angular/cdk/a11y';

const routes: Routes = [
  {path: 'dices', component: DicesComponent},
  {path: 'favorites', component: FavoritesComponent},
  {path: 'roll-log', component: RollLogComponent},
  {path: '**', redirectTo: 'dices', pathMatch: 'full'}
];

@NgModule({
  declarations: [
    AppComponent,
    DiceBagNavigationComponent,
    DicesComponent,
    FavoritesComponent,
    RollLogComponent,
    SaveDicesDialogComponent
  ],
  imports: [

    BrowserModule,
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
      }
    }),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    RouterModule.forRoot(routes),
    EffectsModule.forRoot([AppEffects]),
    BrowserAnimationsModule,
    A11yModule,
    MatSnackBarModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    MatChipsModule,
    MatIconModule,
    FlexLayoutModule,
    MatOptionModule,
    MatTabsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
    MatDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
