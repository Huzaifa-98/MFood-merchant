import { Component, OnInit } from '@angular/core';
import { MenuService } from 'src/app/dashboard/pages/menu/services/menu.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  isPopupOpen: boolean = false;
  popupValue!: any;
  isOpenSidebar: boolean = true;
  sideBarAttributes !: any[];
  isParentVisible: boolean[] = [];

  constructor(private menuServices: MenuService) { }

  ngOnInit(): void {

    this.sideBarAttributes = [
      {
        routerLinkUrlPath: 'home',
        icon: 'home',
        text: 'Home',
      },
      {
        idPath: 'store',
        routerLinkUrlPath: 'stores/store',
        icon: 'store',
        text: 'Stores',
        arrowIcon: 'keyboard_arrow_right',
        child: [
          {
            routerLinkUrlPath: 'stores/store',
            text: 'Store',
          },
          {
            routerLinkUrlPath: 'users',
            text: 'Users',
          }
        ]
      },
      {
        routerLinkUrlPath: 'orders',
        icon: 'store',
        text: 'Orders',
      },
      {
        idPath: 'performance',
        routerLinkUrlPath: 'performance',
        icon: 'bar_chart',
        text: 'Performance',
        arrowIcon: 'keyboard_arrow_right',
        child: [
          {
            routerLinkUrlPath: 'Store',
            text: 'Store',
          },
          {
            routerLinkUrlPath: 'Webshop',
            text: 'Webshop',
          }
        ]
      },
      {
        routerLinkUrlPath: 'marketing',
        icon: 'volume_up',
        text: 'Marketing',
      },
      {
        routerLinkUrlPath: 'menu/overview',
        icon: 'restaurant_menu',
        text: 'Menu',
      },
      {
        idPath: 'setting',
        routerLinkUrlPath: 'setting',
        icon: 'settings',
        text: 'Settings',
        arrowIcon: 'keyboard_arrow_right',
        child: [
          {
            routerLinkUrlPath: 'Store',
            text: 'Store',
          },
          {
            routerLinkUrlPath: 'Webshop',
            text: 'Webshop',
          }
        ]
      },
      {
        routerLinkUrlPath: 'users',
        icon: 'supervised_user_circle',
        text: 'Users',
      },
    ]

  }



  overviewNavIndex: any = 0;
  handlePopUp(event: any) {
    this.isPopupOpen = true;
    this.popupValue = event?.id;
    this.menuServices.setNavIdForMenuTab(this.overviewNavIndex);
  }

  closePopUp() {
    this.popupValue = undefined;
    this.isPopupOpen = false;
  }

  sidebarToggle(status: boolean): boolean {
    return this.isOpenSidebar = !status;
  }

  toggleMenuList(index: number) {
    this.isParentVisible[index] = !this.isParentVisible[index];

    // this.menuSubItem.map(item => item.ChildID === itemId)
  }
}
