import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainPageComponent} from './pages/main-page/main-page.component';

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'mainPage'},
  {
    path: 'mainPage', component: MainPageComponent,
    data: {
      name: 'Main Page'
    }
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class RoutingModule {
}
