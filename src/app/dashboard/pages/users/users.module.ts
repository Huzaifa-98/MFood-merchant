import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { NgPrimeModule } from 'src/app/Shared Module/ng-prime/ng-prime.module';
import { MaterialModule } from 'src/app/Shared Module/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from './user.service';
import { UsersTableComponent } from './users-table/users-table.component';
import { MessageService } from 'primeng/api';
import { UsersUpsertComponent } from './users-upsert/users-upsert.component';


@NgModule({
  declarations: [
    UsersComponent,
    UsersTableComponent,
    UsersUpsertComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    NgPrimeModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [UserService, MessageService],

  
})
export class UsersModule { }
