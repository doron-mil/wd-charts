import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {MainPageComponent} from './pages/main-page/main-page.component';
import {CategoriesListComponent} from './pages/categories/list/categories-list.component';
import {CategoryEditComponent} from './pages/categories/edit/category-edit.component';

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'mainPage'},
  {path: 'mainPage', component: MainPageComponent},
  {path: 'categoriesList', component: CategoriesListComponent},
  {path: 'categoryCreate', component: CategoryEditComponent},
  {path: 'categoryCreate2', component: CategoryEditComponent},
  {path: 'categoryEdit', component: CategoryEditComponent},
  {path: 'categoryView', component: CategoryEditComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class RoutingModule {
}
