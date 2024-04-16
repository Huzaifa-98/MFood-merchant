import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuComponent } from './menu.component';
import { OverviewComponent } from './overview/overview.component';
import { MenusComponent } from './menus/menus.component';
import { CategoriesComponent } from './categories/categories.component';
import { ItemsComponent } from './items/items.component';
import { CustomizationsComponent } from './customizations/customizations.component';

const routes: Routes = [
  {
    path: '',
    component: MenuComponent,
    children: [
      { path: 'overview', component: OverviewComponent },
      { path: 'menus', component: MenusComponent },
      { path: 'categories', component: CategoriesComponent },
      { path: 'items', component: ItemsComponent },
      { path: 'customizations', component: CustomizationsComponent },
    ],
  },
  // { path: '', redirectTo: '/overview', pathMatch: 'full' },

  // Define additional routes for your menu module if needed
];

// export const appRouting = RouterModule.forRoot(routes);

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuRoutingModule {}
