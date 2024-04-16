import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { userModel } from './models/userModel';
import { UserService } from './user.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  visible: boolean = false;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

  showDialog(){
    this.visible = true;
    this.userService.userDialog.next(true);
  }

  handleDialog(){
    this.visible = false;
  }


}
