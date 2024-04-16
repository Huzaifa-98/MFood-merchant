import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-marketing',
  templateUrl: './marketing.component.html',
  styleUrls: ['./marketing.component.css']
})
export class MarketingComponent implements OnInit {

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

    let data = this.activatedRoute.snapshot.routeConfig?.path;
    if(data === 'performance'){
      this.activeTabIndex = 1;
    }
  }
  activeTabIndex:any;
  updateActiveLink(event: MatTabChangeEvent): void {
    debugger
    const activeTabLabel = event.tab?.textLabel;
    this.activeTabIndex = event.index;
    this.router.navigate(['/dashboard/marketing'], {queryParams : {index : activeTabLabel} })

  }


}
