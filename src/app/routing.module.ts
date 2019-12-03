import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {MainPageComponent} from './pages/main-page/main-page.component';
import {CategoriesListComponent} from './pages/categories/list/categories-list.component';
import {CategoryEditComponent} from './pages/categories/edit/category-edit.component';
import {ChartPageComponent} from './pages/chart-page/chart-page.component';
import {ChartsNg2PageComponent} from './pages/charts-ng2-page/charts-ng2-page.component';

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'chartNg2Page'},
  {path: 'mainPageObsolete', component: MainPageComponent},
  {path: 'chartPage', component: ChartPageComponent},
  {path: 'chartNg2Page', component: ChartsNg2PageComponent},
  {path: 'categoriesList', component: CategoriesListComponent},
  {path: 'categoryCreate', component: CategoryEditComponent},
  {path: 'categoryEdit', component: CategoryEditComponent},
  {path: 'categoryView', component: CategoryEditComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class RoutingModule {
}
