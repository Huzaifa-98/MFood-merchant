import { Component, OnInit } from '@angular/core';
import { MenuService } from '../services/menu.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent implements OnInit {
  category: any[] = [];
  menus: any[] = [];
  divCtgry!: boolean;
  divAddCtgry!: boolean;
  selectedMenuId!: any;
  addNotesLabel: boolean = true;
  addNotesDiv: boolean = false;
  showSaveBtn: boolean = true;
  showDeleteBtn: boolean = false;
  showUpdateBtn: boolean = false;
  infoDialogVisible: boolean = false;
  deleteDialogVisible: boolean = false;
  originalFormValue: any;
  ctgryId: any;
  shopID: any = 3309;

  constructor(
    private formBuilder: FormBuilder,
    private menuServices: MenuService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getCategoriesDetail();
    this.showAllMenues();
    this.divCtgry = true;
    this.divAddCtgry = false;
    this.originalFormValue = this.addCtgryForm.value;

    // console.log(this.originalFormValue);
  }

  addCtgryForm: FormGroup | any = this.formBuilder.group({
    CategoryName: ['', Validators.required],
    Menus: ['', Validators.required],
    Remarks: [''],
  });

  getCategoriesDetail() {
    this.menuServices.getCategoryDetails().subscribe({
      next: (res: any) => {
        const dataObject = res.result;
        this.category = dataObject;

        this.category = this.category.map((menusGroup: any) => {
          menusGroup.MenuNames = '';
          menusGroup.menuListCategoryItems.forEach(
            (menues: any, index: any) => {
              menusGroup.MenuNames += `${menues.name}`;

              if (index < menusGroup.menuListCategoryItems.length - 1) {
                menusGroup.MenuNames += ', ';
              }
            }
          );
          return menusGroup;
        });

        // console.log(this.category);
      },
      error: (response: any) => {
        console.log(response);
      },
    });
  }

  ShowNewCtgry() {
    this.divCtgry = false;
    this.divAddCtgry = true;
    this.showDeleteBtn = false;
  }

  CnfrmbackToCtgryDiv() {
    // Check if the form value has changed
    // console.log(this.addCtgryForm.value);

    const selectedValue: FormGroup = this.addCtgryForm.value;
    // console.log(selectedValue);

    if (selectedValue !== this.originalFormValue) {
      this.infoDialogVisible = true; // Set the flag to true
    } else {
      this.backToCtgryDiv(); // return to main category div if there are no changes
    }
  }

  confirmDelete() {
    this.deleteDialogVisible = true;
  }

  backToCtgryDiv() {
    this.removeAddNotesDiv();
    this.divCtgry = true;
    this.divAddCtgry = false;
    this.showSaveBtn = true;
    this.showUpdateBtn = false;
    this.showDeleteBtn = false;
    this.deleteDialogVisible = false;
    this.infoDialogVisible = false;

    this.addCtgryForm.reset();
  }

  showAllMenues() {
    this.menuServices.getMenusGroup().subscribe({
      next: (apiResponse: any) => {
        const dataObject = apiResponse.result;
        this.menus = dataObject;
        // this.menus = dataObject.ShopMenues.flatMap(
        //   (shopMenu: any) => shopMenu.Menues
        // );

        // console.log(this.menus);
      },
      error: (response: any) => {
        console.log(response);
      },
    });
  }

  showAddNotesDiv() {
    this.addNotesLabel = false;
    this.addNotesDiv = true;
  }

  removeAddNotesDiv() {
    this.addNotesLabel = true;
    this.addNotesDiv = false;
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  saveAddCategory() {
    if (this.addCtgryForm.valid) {
      const menuId = this.addCtgryForm.value.Menus;
      // const split = menuId.join(',');
      const obj = {
        shopId: this.shopID,
        name: this.addCtgryForm.value.CategoryName,
        menuId: menuId,
        notes: this.addCtgryForm.value.Remarks,
      };
      // console.log(obj);

      this.menuServices.addNewCategoryMenu(obj).subscribe({
        next: (res: any) => {
          if (res) {
            // console.log("post response: ", res);

            setTimeout(() => {
              this.addCtgryForm.reset();
              this.removeAddNotesDiv();
              this.backToCtgryDiv(); // Hide divAddCtgry and show divCtgry

              // Recall the getCategoriesDetail method
              this.getCategoriesDetail();
            }, 1000);

            this.messageService.add({
              key: 'saveAlert',
              severity: 'success',
              summary: 'Success',
              detail: 'Category Added Successfully',
            });
          } else {
            this.messageService.add({
              key: 'errorAlert',
              severity: 'error',
              summary: 'Error',
              detail: res,
            });
          }
        },
        error: (response: any) => {
          console.log(response);
        },
      });
      this.addCtgryForm.reset();

      // this.drawer.close();
    } else {
      this.validateAllFormFields(this.addCtgryForm);
      this.messageService.add({
        key: 'errorAlert',
        severity: 'error',
        summary: 'Error',
        detail: 'Fill the fields first!',
      });
    }
  }

  editCategory(id: any) {
    // console.log(id);

    this.ctgryId = id;

    this.menuServices.getCategoryById(id).subscribe({
      next: (res: any) => {
        if (res) {
          const data = res?.result;
          // console.log(data.m_Category);

          data.m_Category.menusId = [];

          data.menuList.forEach((menus: any) => {
            data.m_Category.menusId.push(menus.menuId);
          });
          // console.log(data.m_Category);

          if (this.addCtgryForm) {
            this.showAllMenues();
            this.divCtgry = false;
            this.divAddCtgry = true;
            this.showSaveBtn = false;
            this.showUpdateBtn = true;
            this.showDeleteBtn = true;
            this.showAddNotesDiv();

            this.addCtgryForm.patchValue({
              CategoryName: data.m_Category?.name,
              Menus: data?.m_Category?.menusId,
              Remarks: data?.m_Category?.notes,
            });
          }
        }
      },
      error: (response: any) => {
        console.log(response);
      },
    });
  }

  updateCategory() {
    if (this.addCtgryForm.valid) {
      const obj = {
        shopId: this.shopID,
        name: this.addCtgryForm.value.CategoryName,
        menuId: this.addCtgryForm.value.Menus,
        notes: this.addCtgryForm.value.Remarks,
      };

      this.menuServices.updateCategory(obj, this.ctgryId).subscribe({
        next: (res: any) => {
          if (res) {
            // console.log("post response: ", res);

            setTimeout(() => {
              this.addCtgryForm.reset();
              this.removeAddNotesDiv();
              this.backToCtgryDiv(); // Hide divAddCtgry and show divCtgry

              // Recall the getCategoriesDetail method
              this.getCategoriesDetail();
            }, 1000);

            this.messageService.add({
              key: 'saveAlert',
              severity: 'success',
              summary: 'Success',
              detail: 'Category Updated Successfully',
            });
          } else {
            this.messageService.add({
              key: 'errorAlert',
              severity: 'error',
              summary: 'Error',
              detail: res,
            });
          }
        },
        error: (response: any) => {
          console.log(response);
        },
      });
      this.addCtgryForm.reset();
    } else {
      this.validateAllFormFields(this.addCtgryForm);
      this.messageService.add({
        key: 'errorAlert',
        severity: 'error',
        summary: 'Error',
        detail: 'Fill the fields first!',
      });
    }
  }

  ////////// For Delete Category ///////////
  deleteCtgryById() {
    this.menuServices.deleteCategoryById(this.ctgryId).subscribe({
      next: (res: any) => {
        if (res) {
          // console.log('post response: ', res);

          this.deleteDialogVisible = false;
          setTimeout(() => {
            this.addCtgryForm.reset();
            this.removeAddNotesDiv();
            this.backToCtgryDiv(); // Hide divAddCtgry and show divCtgry

            // Recall the getCategoriesDetail method
            this.getCategoriesDetail();
          }, 1500);

          this.messageService.add({
            key: 'saveAlert',
            severity: 'success',
            summary: 'Success',
            detail: 'Category Deleted Successfully',
          });
        } else {
          this.messageService.add({
            key: 'errorAlert',
            severity: 'error',
            summary: 'Error',
            detail: res,
          });
        }

        this.addCtgryForm.reset();
      },
      error: (response: any) => {
        console.log(response);
      },
    });
  }
}
