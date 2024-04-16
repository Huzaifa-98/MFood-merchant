import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu.component';
import { MenuRoutingModule } from './menu-routing.module';
import { MaterialModule } from 'src/app/Shared Module/material/material.module';
import { NgPrimeModule } from 'src/app/Shared Module/ng-prime/ng-prime.module';
import {MessageService} from 'primeng/api';
import { OverviewComponent } from './overview/overview.component';
import { MenusComponent } from './menus/menus.component';
import { CategoriesComponent } from './categories/categories.component';
import { ItemsComponent } from './items/items.component';
import { CustomizationsComponent } from './customizations/customizations.component';
// import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import {CheckboxModule} from 'primeng/checkbox';
import { NgApexchartsModule } from 'ng-apexcharts';
import {DropdownModule} from 'primeng/dropdown';
import {SelectButtonModule} from 'primeng/selectbutton';
import {AvatarModule} from 'primeng/avatar';
import {AvatarGroupModule} from 'primeng/avatargroup';
import {MultiSelectModule} from 'primeng/multiselect';
import {FileUploadModule} from 'primeng/fileupload';





@NgModule({
  declarations: [
    MenuComponent,
    OverviewComponent,
    MenusComponent,
    CategoriesComponent,
    ItemsComponent,
    CustomizationsComponent
  ],
  providers: [MessageService],
  imports: [
    CommonModule,
    MenuRoutingModule,
    MaterialModule,
    FormsModule,
    NgPrimeModule,
    // NgSelectModule,
    DragDropModule,
    TableModule,
    ReactiveFormsModule,
    CheckboxModule,
    NgApexchartsModule,
    DropdownModule,
    SelectButtonModule,
    AvatarModule,
    AvatarGroupModule,
    MultiSelectModule,
    FileUploadModule
  ]
})
export class MenuModule { }
