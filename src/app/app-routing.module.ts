import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { AuthenticationComponent } from './Modules/authentication/authentication.component';
import { OrdersComponent } from './dashboard/pages/orders/orders.component';

const routes: Routes = [
  
  {
    path: '',
    redirectTo: 'authentication/main',
    pathMatch: 'full'
  },

  // AUTHENTICATION ROUTING //

  {
    path: 'authentication',
    component: AuthenticationComponent,
    data: {
      title: 'Authentication'
    },
    loadChildren: () =>
      import('./Modules/authentication/authentication.module').then((m) => m.AuthenticationModule)
  },

  // AUTHENTICATION ROUTING //

  // LAYOUT ROUTING //

  {
    path: 'dashboard',
    component: LayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('./dashboard/pages/home/home.module').then((m) => m.HomeModule)
      },
      {
        path: 'stores',
        loadChildren: () =>
          import('./dashboard/pages/stores/stores.module').then((m) => m.StoresModule)
      },
      {
        path: 'orders',
        component: OrdersComponent
      },
      {
        path: 'marketing',
        loadChildren: () =>
          import('./dashboard/pages/marketing/marketing.module').then((m) => m.MarketingModule)
      },
      {
        path: 'menu',
        loadChildren: () =>
          import('./dashboard/pages/menu/menu.module').then((m) => m.MenuModule)
      },
      {
        path: 'users',
        loadChildren: () =>
          import('./dashboard/pages/users/users.module').then((m) => m.UsersModule)
      },
    ]
  },

  // LAYOUT ROUTING //

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
