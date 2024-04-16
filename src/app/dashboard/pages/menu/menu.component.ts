import { Component, OnInit, ViewChild } from '@angular/core';
// import { MatTabChangeEvent } from '@angular/material/tabs';
// import { TabPanel } from 'primeng/tabview';
import { MenuService } from 'src/app/dashboard/pages/menu/services/menu.service';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  navLinks!: any[];

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private menuService: MenuService) {
    this.navLinks = [
      {
        label: 'overview',
        link: './overview',
        index: 0,
      },
      {
        label: 'menus',
        link: './menus',
        index: 1,
      },
      {
        label: 'categories',
        link: './categories',
        index: 2,
      },
      {
        label: 'items',
        link: './items',
        index: 3,
      },
      {
        label: 'customizations',
        link: './customizations',
        index: 4,
      },
    ];
  }
  activeTabIndex: any;
  selectedTab!: string;
  ngOnInit(): void {

    this.activeTabIndex = 0;
    this.menuService.NavIdForMenuTab().subscribe(val => {
      this.activeTabIndex = val
    });

    const currentUrl = window.location.href;

    // Split the URL by "/"
    const urlParts = currentUrl.split('/');

    // Get the last word after the last "/"
    const lastWord = urlParts[urlParts.length - 1];

    const navLink = this.navLinks.find(link => link.label === lastWord);
    // console.log(navLink.index);

    if(navLink){
      this.activeTabIndex = navLink.index;
      // console.log(navLink.index);
      
    }
    
  }

  updateActiveLink(event: any): void {
    // console.log(event);

    this.selectedTab = event?.tab?.textLabel;
    this.router.navigate(['/dashboard/menu/' + this.selectedTab]);
    this.activeTabIndex = event.index;

  }
}
