import { Component, ElementRef, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { CdkDragDrop, CdkDropList, CdkDrag, CdkDragHandle, moveItemInArray } from '@angular/cdk/drag-drop';
import { MenuService } from 'src/app/dashboard/pages/menu/services/menu.service';
import { MatDrawer } from '@angular/material/sidenav';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css'],
})
export class OverviewComponent implements OnInit {
  @ViewChild('drawer') drawer: MatDrawer | any;
  @Output() event = new EventEmitter<any>();

  isCardVisible: boolean = true;
  isLoading: boolean = false;
  isParentVisible: boolean[] = [];
  // isDraggable: boolean = true;
  infoDialogVisible: boolean = false;
  allMenuListToggle: boolean = true;
  UncategorizedListToggle: boolean = false;
  showMenuOptions: boolean = false;
  menus: any[] = [];
  menuTimings: any[] = [];
  selectedMenuCategory: any[] = [];
  menuDays!: any[];
  menuItem!: any[];
  menuDaysHrs: any;
  searchMenuItem!: any[];
  selectedMenuItem!: any;
  selectedMenuName!: any;
  addOptions: any[] = [];
  sideNavId: any;
  sideNavName: any;
  addCtgName: any;
  addCtgMenu: any;
  addCtgNotes: any;
  addCtgryForm!: FormGroup;
  addItemForm!: FormGroup;
  addCustomizationForm!: FormGroup;
  category: any[] = [];
  addCtgryLblAndBtn: boolean = true;
  editCtgryLblAndBtn: boolean = false;
  addItemLblAndBtn: boolean = true;
  editItemLblAndBtn: boolean = false;
  isOpen: boolean = false;
  ctgryId: any;
  image!: any;
  imageUrl!: any;
  itemId!: any;
  searchTerm: string = '';
  shopID: any = 3309;
  createDialogVisible: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private menuServices: MenuService,
    private messageService: MessageService
  ) {
    this.menuDays = [
      { name: 'Mon', value: '1' },
      { name: 'Tue', value: '2' },
      { name: 'Wed', value: '3' },
      { name: 'Thu', value: '4' },
      { name: 'Fri', value: '5' },
      { name: 'Sat', value: '6' },
      { name: 'Sun', value: '7' },
    ];
  }

  ngOnInit(): void {
    this.showAllMenues();
    this.showAddOptions();
    this.getCategoriesDetail();
    this.addCtgryForm = this.formBuilder.group({
      CategoryName: ['', Validators.required],
      Menus: ['', Validators.required],
      Remarks: [''],
    });

    this.addItemForm = this.formBuilder.group({
      ItemName: ['', Validators.required],
      Categories: ['', Validators.required],
      Notes: [''],
      Description: [''],
      Price: [''],
    });

    this.addCustomizationForm = this.formBuilder.group({
      CustomizationName: ['', Validators.required],
      Notes: ['']
    });

  }


  // Search filteration in category and item in drag drop list
  filteredMenuItems(): any[] {
    if(this.searchTerm == '') {
      // this.isParentVisible = Array(this.menuItem.length).fill(false);
      return this.menuItem;
    } else {
      // this.isParentVisible = Array(this.menuItem.length).fill(true);
      return this.menuItem.filter(item => {
        // Check if either categoryName or subItem.name contains the search term
        const searchKeyword = this.searchTerm.toLowerCase();
        return item.categoryName.toLowerCase().includes(searchKeyword) ||
          item.menuListCategoryItems.some((subItem: any) => subItem.name.toLowerCase().includes(searchKeyword));
        
      });
    }
  }

  onUpload(event: any) {
    const file: File = event.target.files[0];
    this.imageUrl = file;
    // console.log(this.imageUrl);

    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.image = e.target.result;
      };
      reader.readAsDataURL(file);
    }

    this.messageService.add({
      key: 'saveAlert',
      severity: 'success',
      summary: 'Success',
      detail: 'Image Uploaded Successfully',
    });
  }

  showAddOptions() {
    this.addOptions = [
      {
        id: '1',
        Name: 'Add item',
      },
      {
        id: '2',
        Name: 'Add category',
      },
      {
        id: '3',
        Name: 'Add customizations',
      },
    ];
  }

  getSelectedMenuName(Menuid: any, name: any) {
    this.selectedMenuName = name;

    //For Menu Timings
    this.getMenuTimingsByMenuId(Menuid);

    if(Menuid) {
      this.menuServices.getMenuListItemSubItem(Menuid).subscribe({
        next: (res: any) => {
          if (res) {
            const data = res?.result;
            this.menuItem = data;
            this.searchMenuItem = data;
            
            this.itemCountPlaceholder();
          } else {
            this.menuItem = [];
            this.searchMenuItem = [];
          }
  
          // console.log(Menuid);
          // console.log(this.menuItem);
          // console.log(data);
        },
        error: (response: any) => {
          console.log(response);
        },
      });
    }
  }

  itemCountPlaceholder() {
    let totalLength = this.searchMenuItem.reduce((total, item) => {
      return total + item.menuListCategoryItems.length;
    }, 0);
    // console.log("Total length:", totalLength);
    return "Search " + totalLength + " Items";
  }

  navLinkId: any = 3;
  routeToItems() {
    this.menuServices.setNavIdForMenuTab(this.navLinkId);
    this.router.navigate(['/dashboard/menu/items']);
    // this.event.emit(this.navLinkId);
  }

  getMenuTimingsByMenuId(Menuid: any) {
    // console.log(Menuid);

    this.menuTimings = this.menus.filter((x: any) => x.menuId == Menuid);

    // Create a dictionary for quick lookup
    const dayIdToName: any = {};
    this.menuDays.forEach((day: any) => {
      dayIdToName[day.value] = day.name;
    });

    const datePipe = new DatePipe('en-US');

    this.menuDaysHrs = '';

    this.menuTimings.forEach((menuItem) => {
      menuItem.menuTimings.forEach((menuTiming: any) => {
        const dayNames = menuTiming.menuTimingDays
          .map((day: any) => dayIdToName[day.dayId])
          .join(',');
        const startTime = datePipe.transform(menuTiming.startTime, 'h:mm a');
        const endTime = datePipe.transform(menuTiming.endTime, 'h:mm a');
        const timeRange = `${startTime} - ${endTime}`;

        menuTiming.menuHrs = `${dayNames}: ${timeRange}`;
        // console.log(`${dayNames}: ${timeRange}`);
      });
    });

    this.menuTimings.map((menuTime: any) => {
      menuTime.menuDaysHrs = '';

      menuTime.menuTimings.forEach((menuDetails: any, index: number) => {
        menuTime.menuDaysHrs += `${menuDetails.menuHrs}`;

        if (index < menuTime.menuTimings.length - 1) {
          menuTime.menuDaysHrs += ', ';
        }
      });
    });

    // console.log(this.menuTimings);

    // console.log(this.menuTimings);
  }

  // filterMenuList(): any {
  //   if (this.selectedMenuItem) {
  //     this.menuItem = this.menuItem.filter(
  //       (x) => x.ID === this.selectedMenuItem
  //     );
  //     // console.log(filteredMenuItem);
  //     // return filteredMenuItem;
  //   }
  // }

  routeToEditMenu() {
    // console.log(this.menuTimings[0]?.menuId);

    this.navLinkId = 1;
    setTimeout(() => {
      this.menuServices.setNavIdForMenuTab(this.navLinkId);
    }, 1000);
    this.menuServices.setEditMenuObj(this.menuTimings[0]?.menuId);
    this.router.navigate(['/dashboard/menu/menus']);
  }

  showAllMenues() {
    this.isLoading = true;
    this.menuServices.getMenusGroup().subscribe({
      next: (apiResponse: any) => {
        if (apiResponse?.result) {
          const dataObject = apiResponse?.result;
          this.menus = dataObject;

          // console.log(dataObject);

          if (this.menus.length > 0) {
            const firstMenu = this.menus[0]; // Get the first menu
            // console.log(firstMenu);
            this.getSelectedMenuName(firstMenu?.menuId, firstMenu?.name);
          }
          setTimeout(() => {
            this.isLoading = false;
          }, 1000);

          // console.log(this.menus);
        }
      },
      error: (response: any) => {
        console.log(response);
      },
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.menuItem, event.previousIndex, event.currentIndex);
  }

  hideCard() {
    this.isCardVisible = false;
  }

  showDialog() {
    this.infoDialogVisible = true;
  }

  toggleMenuList(index: number) {
    this.isParentVisible[index] = !this.isParentVisible[index];

    if(this.isParentVisible[index]) {
      setTimeout(() => {
        this.isOpen = true;
      },20);
    } else {
      this.isOpen = false;
    }
  }

  toggleAllMenuList() {
    this.allMenuListToggle = !this.allMenuListToggle;

    if (this.allMenuListToggle == false) {
      this.isParentVisible = Array(this.menuItem.length).fill(true);
      setTimeout(() => {
        this.isOpen = true;
      },20);
    } else {
      this.isParentVisible = Array(this.menuItem.length).fill(false);
      this.isOpen = false;
    }
  }

  // ToggleMenuOptions(){
  //   this.showMenuOptions = !this.showMenuOptions;
  // }

  toggleUncategorizedList() {
    this.UncategorizedListToggle = !this.UncategorizedListToggle;
  }

  showAddOptionNavbar(id: any) {
    this.addCtgryLblAndBtn = true;
    this.editCtgryLblAndBtn = false;
    this.addItemLblAndBtn = true;
    this.editItemLblAndBtn = false;

    //For customization popup
    if(id == '3') {
      setTimeout(() => {
        this.createDialogVisible = true;
      },800);
      
    }
    this.drawer.open();
    this.sideNavId = id;
    // console.log(id);
  }

  closedrawer() {
    this.addCtgryForm.reset();
    this.addItemForm.reset();
    this.addCtgryLblAndBtn = true;
    this.editCtgryLblAndBtn = false;
    this.imageUrl = '';
    this.image = '';
    this.drawer.close();
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
        shopId: 3022,
        name: this.addCtgryForm.value.CategoryName,
        menuId: [menuId],
        notes: this.addCtgryForm.value.Remarks,
      };

      // console.log(obj);
      this.menuServices.addNewCategoryMenu(obj).subscribe({
        next: (res: any) => {
          if (res) {
            // console.log("post response: ", res);

            setTimeout(() => {
              this.closedrawer(); // close drawer and reset all forms

              // Recall the showAllMenues method
              this.showAllMenues();
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
      this.messageService.add({
        key: 'errorAlert',
        severity: 'error',
        summary: 'Error',
        detail: 'Fill the fields first!',
      });
    }
  }

  getCategoriesDetail() {
    this.menuServices.getCategoryDetails().subscribe({
      next: (res: any) => {
        const dataObject = res.result;
        this.category = dataObject;

        // console.log(this.category);
      },
      error: (response: any) => {
        console.log(response);
      },
    });
  }

  /////// For Edit Category
  editCategory(id: any, drawerId: any) {
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
            // this.showAllMenues();
            this.addCtgryLblAndBtn = false;
            this.editCtgryLblAndBtn = true;
            this.drawer.open();
            this.sideNavId = drawerId;

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

    // this.addCtgryLblAndBtn = false;
    // this.editCtgryLblAndBtn = true;
    // this.drawer.open();
    // this.sideNavId = drawerId;
    // console.log(ctgData);
  }

  ////// For Update Category
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
              this.addCtgryLblAndBtn = true;
              this.editCtgryLblAndBtn = false;
              this.drawer.close(); // Close side drawer
              this.showAllMenues(); // Recall the showAllMenues method
            }, 1500);

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

  //For Add item
  saveAddItem() {
    if (this.addItemForm.valid) {
      const status:string = '1';

      const formData = new FormData();
      const ctgIds = this.addItemForm?.value.Categories.map((val: any) => val);
      
      ctgIds.forEach((value:any) => {
        formData.append('M_CategoryId', value);
      });
      formData.append('Name', this.addItemForm?.value.ItemName);
      formData.append('Discription', this.addItemForm?.value.Description);
      formData.append('MenuImage_icon', this.imageUrl);
      formData.append('BaseAmount', this.addItemForm?.value.Price);
      formData.append('Status', status);
      formData.append('Remarks', this.addItemForm?.value.Notes);
      // console.log(obj);

      this.menuServices.addNewCategoryItem(formData).subscribe({
        next: (res: any) => {
          if (res) {
            // console.log('post response: ', res);

            setTimeout(() => {
              this.closedrawer(); // close drawer and reset all forms

              // Recall the showAllMenues method
              this.showAllMenues();
            }, 1000);

            this.messageService.add({
              key: 'saveAlert',
              severity: 'success',
              summary: 'Success',
              detail: 'Item Added Successfully',
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
      this.addItemForm.reset();
    } else {
      this.messageService.add({
        key: 'errorAlert',
        severity: 'error',
        summary: 'Error',
        detail: 'Fill the fields first!',
      });
    }
  }

  //// For Edit Item
  editItem(itemId: any, drawerId: any) {

    this.itemId = itemId;

    this.menuServices.getItemByItemId(itemId).subscribe({
      next: (res: any) => {
        if (res) {
          const data = res?.result;
          // console.log(data);

          this.image = data?.image;
          if (this.addItemForm) {
            this.addItemLblAndBtn = false;
            this.editItemLblAndBtn = true;
            this.drawer.open();
            this.sideNavId = drawerId;

            this.addItemForm.patchValue({
              ItemName: data?.name,
              Notes: data?.remarks,
              Description: data?.description,
              Categories: [data?.categoryItemMapping[0]?.id],
              Price: data?.baseAmount,
            });
          }
        }
      },
      error: (response: any) => {
        console.log(response);
      },
    });

    // this.addItemLblAndBtn = false;
    // this.editItemLblAndBtn = true;
    // this.drawer.open();
    // this.sideNavId = drawerId;
    // console.log(itemId);
  }

  //For Add item button in item drag drop list
  addSelectedCtgryItem(ctgryId: any, drawerId: any) {
    this.drawer.open();
    this.sideNavId = drawerId;

    this.addItemForm.patchValue({
      Categories: [ctgryId],
    });
  }

  ////// For Update Item
  updateItem() {
    if(this.addItemForm.valid) {
      const status:string = '1';

      const formData = new FormData();
      const ctgIds = this.addItemForm?.value.Categories.map((val: any) => val);
      
      ctgIds.forEach((value:any) => {
        formData.append('M_CategoryId', value);
      });
      formData.append('Name', this.addItemForm?.value.ItemName);
      formData.append('Discription', this.addItemForm?.value.Description);
      formData.append('MenuImage_icon', this.imageUrl);
      formData.append('BaseAmount', this.addItemForm?.value.Price);
      formData.append('Status', status);
      formData.append('Remarks', this.addItemForm?.value.Notes);

      this.menuServices.updateItemById(formData, this.itemId)
      .subscribe({
        next: (res: any) => {
          if(res){
            // console.log("post response: ", res);

            setTimeout(() => {
              this.closedrawer(); // close drawer and reset all forms

              // Recall the showAllMenues method
              this.showAllMenues();
            }, 1500);

            this.messageService.add({key: 'saveAlert', severity:'success', summary: 'Success', detail: 'Item Updated Successfully'});

          }else{
            this.messageService.add({key: 'errorAlert', severity:'error', summary: 'Error', detail: res});
          }
        },
        error: (response: any) => {
          console.log(response);
        },
      });

      this.addItemForm.reset();
    } else {
      this.validateAllFormFields(this.addItemForm);
      this.messageService.add({
        key: 'errorAlert',
        severity: 'error',
        summary: 'Error',
        detail: 'Fill the fields first!',
      });
    }
  }

  returnToCustomization() {
    this.addCustomizationForm.reset();
    this.createDialogVisible = false
  }

  saveCustomization() {
    if(this.addCustomizationForm.valid) {
      console.log(this.addCustomizationForm.value);
      
    }
  }
}
