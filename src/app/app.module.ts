import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutComponent } from './layout/layout.component';
import { MaterialModule } from './Shared Module/material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { NgPrimeModule } from './Shared Module/ng-prime/ng-prime.module';
import { OrdersComponent } from './dashboard/pages/orders/orders.component';
// import { OrdersComponent } from './dashboard/pages/orders/orders.component';

@NgModule({
  declarations: [AppComponent, LayoutComponent, OrdersComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    NgPrimeModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
