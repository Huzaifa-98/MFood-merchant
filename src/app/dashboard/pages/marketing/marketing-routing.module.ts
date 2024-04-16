import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MarketingComponent } from './marketing.component';
import { GoalsComponent } from './goals/goals.component';

const routes: Routes = [
  {
    path: '',
    component: MarketingComponent,
    data: {
      title: 'Marketing',
    },
  },
  {
    path: 'performance',
    component: MarketingComponent,
    data: {
      title: 'Performance',
    },
  },
  {
    path: 'campaigns',
    component: MarketingComponent,
    data: {
      title: 'Campaigns',
    },
  },
  {
    path: 'goals/:goal',
    component: GoalsComponent,
    data: {
      title: 'Goals',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarketingRoutingModule { }
