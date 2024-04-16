import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { UserService } from '../user.service';
import { userModel } from '../models/userModel';

@Component({
  selector: 'app-users-upsert',
  templateUrl: './users-upsert.component.html',
  styleUrls: ['./users-upsert.component.css']
})
export class UsersUpsertComponent implements OnInit {

  @Input() visible: boolean = false;
  @Output() handleDialogVisible = new EventEmitter<{ visible: boolean }>();
  UserRowData: any;
  isUserUpdateBtn: boolean = false;
  constructor(private formBuilder: FormBuilder, private userService: UserService, private messageService: MessageService) { }


  userForm = this.formBuilder.group({
    Id: [''],
    FirstName: ['', Validators.required],
    LastName: ['', Validators.required],
    Email: ['', [Validators.required, Validators.email]],
    Phone1: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(11), Validators.maxLength(11)]],
    ShopId: ['']

  })

  validatePhone(){
    this.userForm.controls.Phone1.valueChanges.subscribe((phoneNumber : String | null) => {
      if(phoneNumber?.length! > 11){
        const validatePhone = phoneNumber!.slice(0, -1);
        this.userForm.get('Phone1')?.setValue(validatePhone);
      }
    });
  }


  ngOnInit(): void {
    this.validatePhone();
    this.isUserUpdateBtn = false;
    this.userService.userDialog$().subscribe((response) => {
      this.visible = response?.visibleStatus;
      this.UserRowData = response?.userData;

      if (this.UserRowData?.Id != '' && this.UserRowData?.Id != null) {
        this.userForm.patchValue({
          Id: this.UserRowData?.Id,
          FirstName: this.UserRowData?.FirstName,
          LastName: this.UserRowData?.LastName,
          Email: this.UserRowData?.Email,
          Phone1: this.UserRowData?.Phone1,
          ShopId: this.UserRowData?.ShopId
        });
        this.isUserUpdateBtn = true;

        if(this.userForm.invalid){
          this.userForm.markAllAsTouched();
        }
      }
      else {
        this.userForm.markAllAsTouched();
        this.isUserUpdateBtn = false;
      }
    })
  }


  showDialog() {
    this.visible = true;

  }
  hideDialog() {
    this.handleDialogVisible.emit({ visible: false });
    this.visible = false;
    this.userForm.reset();
  }
  createUserForm() {
    const userDataForm = this.userForm.getRawValue();
    this.visible = false;

    if (userDataForm?.Id == '' || userDataForm?.Id == null) {
      const userDataModel: userModel = {
        FirstName: userDataForm.FirstName,
        LastName: userDataForm.LastName,
        Email: userDataForm.Email,
        Phone1: userDataForm.Phone1,
        ShopId: 1
      }
      if (this.userForm?.valid) {
        this.userForm.disabled;
        this.userService.postUserFormData(userDataModel).subscribe((response) => {
          if (response) {
            this.userForm.reset();
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User Created Successfully' });
            this.userService.userLoadData.next(true);
          }
        })

      }
    }

    else {
      const userDataModel: userModel = {
        Id: userDataForm?.Id,
        FirstName: userDataForm?.FirstName,
        LastName: userDataForm?.LastName,
        Email: userDataForm?.Email,
        Phone1: userDataForm?.Phone1,
        ShopId: userDataForm?.ShopId
      }
      if (this.userForm?.valid) {
        this.userForm.disabled;
        this.userService.putUserFormData(userDataModel).subscribe((response) => {
          if (response) {
            this.userForm.reset();
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User Updated Successfully' });
            this.userService.userLoadData.next(true);
          }
        })

      }
    }

    
  }

}
