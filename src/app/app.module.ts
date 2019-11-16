import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {DevToolsExtension, NgRedux, NgReduxModule} from '@angular-redux/store';
import {applyMiddleware, combineReducers, compose, createStore, Store} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';

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
import {HttpClientModule} from '@angular/common/http';
import { CategoriesListComponent } from './pages/categories/list/categories-list.component';
import {CategoryEditComponent} from './pages/categories/edit/category-edit.component';
import { HeaderComponent } from './components/header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    CategoriesListComponent,
    CategoryEditComponent,
    HeaderComponent
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
