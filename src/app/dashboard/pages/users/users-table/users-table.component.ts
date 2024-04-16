import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { userModel } from '../models/userModel';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UserService } from '../user.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.css']
})
export class UsersTableComponent implements OnInit {


  // Material Table & Pagination Section

  displayedColumns: string[] = ['Name', 'Email', 'Phone1', 'Actions'];
  dataSource!: MatTableDataSource<userModel>;
  pageIndex = 0;
  pageSize = 10;
  pageSizeOptions = [10, 15, 20];
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Material Table & Pagination Section


  // Variables Initialized

  userData!: any;
  usersDataList: any;
  isLoading: boolean = false;
  deleteDialogVisible:  boolean = false;
  userDeleteData!: userModel;
  // Variables Initialized


  constructor(private userService: UserService, private messageService: MessageService) {
    this.getUsersList();

  }

  ngOnInit(): void {
    this.userService.userLoadData$().subscribe((response)=> {
      this.getUsersList();
    })

  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  getUsersList() {
    this.isLoading = true;
    this.userService.getUsersListByShopId(1).subscribe((response) => {
      if (response) {
        this.userData = response;
        // debugger
        this.usersDataList = JSON.parse(this.userData?.Result?.Data);
        this.dataSource = new MatTableDataSource(this.usersDataList);
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
        setTimeout(() => { this.isLoading = false; }, 1000);
      }
      else{
        // notFound = ''
      }
    });
  }

  showDialog(userData: userModel){
    const visibleStatus = true;
    let record = {userData, visibleStatus};
    this.userService.userDialog.next(record);
  }

  showDeleteDialog(userData: userModel){
    this.deleteDialogVisible = true;
    this.userDeleteData = userData;
  
  }

  deleteUser(){
    this.userDeleteData.IsDelete = 1;
    this.userService.putUserFormData(this.userDeleteData).subscribe((response)=>{
      this.deleteDialogVisible = false;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'User Deleted Successfully' });

    })
  }

}
