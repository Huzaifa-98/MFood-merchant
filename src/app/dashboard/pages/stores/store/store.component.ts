import { Component, OnInit , EventEmitter, Output, Input, ViewChild} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSidenav } from '@angular/material/sidenav';


const ELEMENT_DATA: any[] = [
  {
    id: 1,
    url: 'https://d1ralsognjng37.cloudfront.net/ec69f56a-6051-4cca-88b4-b22b33175932.webp',
    name: 'D&D Butchery (2655 Lawrence Avenue East) ', count: 5, status: 'closed', sales: 'CA$0', orders: 0
  },
  {
    id: 2,
    url: 'https://d1ralsognjng37.cloudfront.net/ec69f56a-6051-4cca-88b4-b22b33175932.webp',
    name: 'D&D Butchery (2655 Lawrence Avenue East) ', count: 5, status: 'closed', sales: 'CA$0', orders: 0
  },
];


@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})
export class StoreComponent implements OnInit {

  constructor() { }
  isLoading: boolean = true;
  EditActive: any;
  isBackdrop : boolean = true;
  displayedColumns: string[] = ['url', 'name', 'count', 'status', 'sales', 'orders', 'actions'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  @ViewChild('sidenav') sidenav!: MatSidenav;


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  sort = new FormControl('');
  sortList: string[] = ['Alphabetical', 'Availability (default)', 'Orders', 'Rating', 'Sales'];
  sidebarVisible!: boolean;


  ngOnInit(): void {
  }
  handleToggle(element: any) {
    debugger
    if (this.EditActive === element?.id) {
      this.EditActive = null;
    }
    else if(0 === element){
      this.EditActive = null;
    }
    else {
      this.EditActive = element?.id;
    }

  }
  closeSidebar(): void {
    this.sidenav.close();
  }


  handleSidebar(element: any){
    this.sidebarVisible = true;

  }

}
