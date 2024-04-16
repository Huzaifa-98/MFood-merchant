import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoresRoutingModule } from './stores-routing.module';
import { StoresComponent } from './stores.component';
import { StoreComponent } from './store/store.component';
import { MaterialModule } from 'src/app/Shared Module/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NgPrimeModule } from 'src/app/Shared Module/ng-prime/ng-prime.module';


@NgModule({
  declarations: [
    StoresComponent,
    StoreComponent
  ],
  imports: [
    CommonModule,
    StoresRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    MatSidenavModule,
    NgPrimeModule
  ]
})
export class StoresModule { }
