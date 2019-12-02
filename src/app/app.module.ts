import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import {DevToolsExtension, NgRedux, NgReduxModule} from '@angular-redux/store';
import {applyMiddleware, combineReducers, compose, createStore, Store} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';

import {NgxChartsModule} from '@swimlane/ngx-charts';

import {ChartsModule} from 'ng2-charts';

import {AppComponent} from './app.component';
import {MainPageComponent} from './pages/main-page/main-page.component';
import {RoutingModule} from './routing.module';
import {MaterialModule} from './material/material.module';
import {ReduxGeneralMiddlewareService} from './store/middleware/feature/general.mid';

import {ReduxApiMiddlewareService} from './store/middleware/core/api.mid';

import {StoreDataTypeEnum} from './store/storeDataTypeEnum';
import {staticDataReducer} from './store/reducers/static.data.reducer';
import {dynamicDataReducer} from './store/reducers/dynamic.data.reducer';
import {innerReducer} from './store/reducers/inner.data.reducer';
import { CategoriesListComponent } from './pages/categories/list/categories-list.component';
import {CategoryEditComponent} from './pages/categories/edit/category-edit.component';
import { HeaderComponent } from './components/header/header.component';
import { ChartPageComponent } from './pages/chart-page/chart-page.component';
import { ChartsNg2PageComponent } from './pages/charts-ng2-page/charts-ng2-page.component';

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    CategoriesListComponent,
    CategoryEditComponent,
    HeaderComponent,
    ChartPageComponent,
    ChartsNg2PageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    BrowserAnimationsModule,
    RoutingModule,
    NgReduxModule,
    HttpClientModule,
    NgxChartsModule,
    ChartsModule,
  ],
  providers: [ReduxApiMiddlewareService, ReduxGeneralMiddlewareService],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(private ngRedux: NgRedux<any>,
              private devTools: DevToolsExtension,
              generalMiddlewareService: ReduxGeneralMiddlewareService,
              apiMiddlewareService: ReduxApiMiddlewareService,) {

    // ***********************************************
    // ******* Redux - Redux-offline config **********
    // ***********************************************

    // --------------     Middleware        --------------
    const featureMiddleware = [
      generalMiddlewareService.generalMiddleware,
    ];

    const coreMiddleware = [
      apiMiddlewareService.apiMiddleware,
    ];


    // --------------     Reducers          --------------
    const rootReducer = combineReducers({
      [StoreDataTypeEnum.STATIC_DATA]: staticDataReducer,
      [StoreDataTypeEnum.DYNAMIC_DATA]: dynamicDataReducer,
      [StoreDataTypeEnum.INNER_DATA]: innerReducer,
    });

    // --------------     Store Creation    --------------
    const store: Store = createStore(
      rootReducer,
      composeWithDevTools(
        applyMiddleware(...featureMiddleware, ...coreMiddleware),
      )
    );

    ngRedux.provideStore(store);

  }
}
// TS2589: Type instantiation is excessively deep and possibly infinite. ⌥⇧⏎ ⌥⏎
