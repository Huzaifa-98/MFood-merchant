import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SidebarModule } from 'primeng/sidebar';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { MenuModule } from 'primeng/menu';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { AccordionModule } from 'primeng/accordion';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ListboxModule } from 'primeng/listbox';
import {InputNumberModule} from 'primeng/inputnumber';
import {TabViewModule} from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import {CalendarModule} from 'primeng/calendar';


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports: [
    CarouselModule,
    ButtonModule,
    DialogModule,
    OverlayPanelModule,
    SidebarModule,
    ToastModule,
    TooltipModule,
    MenuModule,
    CardModule,
    AvatarModule,
    AvatarGroupModule,
    AccordionModule,
    InputTextModule,
    MultiSelectModule,
    InputTextareaModule,
    ListboxModule,
    InputNumberModule,
    TabViewModule,
    TableModule,
    CalendarModule
  ]
})
export class NgPrimeModule { }
