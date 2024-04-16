import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MarketingRoutingModule } from './marketing-routing.module';
import { MarketingComponent } from './marketing.component';
import { MaterialModule } from 'src/app/Shared Module/material/material.module';
import { NgPrimeModule } from 'src/app/Shared Module/ng-prime/ng-prime.module';
import { CreateCampaignComponent } from './create-campaign/create-campaign.component';
import { GoalsComponent } from './goals/goals.component';


@NgModule({
  declarations: [
    MarketingComponent,
    CreateCampaignComponent,
    GoalsComponent,
  ],
  imports: [
    CommonModule,
    MarketingRoutingModule,
    MaterialModule,
    NgPrimeModule

  ]
})
export class MarketingModule { }
