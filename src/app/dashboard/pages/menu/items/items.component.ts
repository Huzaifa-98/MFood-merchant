import { Component, OnInit } from '@angular/core';
import { MenuService } from '../services/menu.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css'],
})
export class ItemsComponent implements OnInit {
  categoryItems: any[] = [];
  image!: any;
  imageUrl!: any;
  category: any[] = [];
  divItems!: boolean;
  divAddItems!: boolean;
  infoDialogVisible: boolean = false;
  deleteDialogVisible: boolean = false;
  addNotesLabel: boolean = true;
  addNotesDiv: boolean = false;
  showSaveBtn: boolean = true;
  showDeleteBtn: boolean = false;
  showUpdateBtn: boolean = false;
  originalFormValue!: any;
  itemId!: any;

  addItemForm: FormGroup | any = this.formBuilder.group({
    ItemName: ['', Validators.required],
    Remarks: [''],
    Description: [''],
    Categories: ['', Validators.required],
    Price: [''],
  });

  constructor(
    private formBuilder: FormBuilder,
    private menuServices: MenuService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getItemsDetails();
    this.getCategoriesDetail();
    this.divItems = true;
    this.divAddItems = false;
  }

  onUpload(event: any) {
    const file: File = event.target.files[0];
    this.imageUrl = file;
    // console.log(event);

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

  CnfrmbackToCtgryDiv() {
    // Check if the form value has changed
    // console.log(this.addCtgryForm.value);

    const selectedValue: FormGroup = this.addItemForm.value;
    // console.log(selectedValue);

    if (selectedValue !== this.originalFormValue) {
      this.infoDialogVisible = true; // Set the flag to true
    } else {
      this.backToItemsDiv(); // return to main item div if there are no changes
    }
  }


  backToItemsDiv() {
    this.removeAddNotesDiv();
    this.divItems = true;
    this.divAddItems = false;
    this.showSaveBtn = true;
    this.showUpdateBtn = false;
    this.showDeleteBtn = false;
    this.infoDialogVisible = false;
    this.imageUrl = '';
    this.image = '';

    this.addItemForm.reset();
  }

  AddNewItemsDiv() {
    this.divItems = false;
    this.divAddItems = true;
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

  getItemsDetails() {
    this.menuServices.getItemDetails().subscribe({
      next: (res: any) => {
        // const dataObject = res.result;
        // this.categoryItems = dataObject;
        // console.log(res?.result);
        this.categoryItems = res?.result;

      },
      error: (response: any) => {
        console.log(response);
      },
    });
  }

  getLimitedText(text: string, limit: number): string {
    if (!text) {
      return '';
    }

    const words = text.split(' ');
    const limitedWords = words.slice(0, limit);

    if (words.length > limit) {
      // Add three dots at the end of the last word
      limitedWords[limit - 1] += '...';
    }

    return limitedWords.join(' ');
  }

  showAddNotesDiv() {
    this.addNotesLabel = false;
    this.addNotesDiv = true;
  }

  removeAddNotesDiv() {
    this.addNotesLabel = true;
    this.addNotesDiv = false;
  }

  confirmDelete() {
    this.deleteDialogVisible = true;
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

  saveAddItems() {
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
      formData.append('Remarks', this.addItemForm?.value.Remarks);

      // formData.forEach((val: any, key: any) => {
      //   console.log(`${key}: ${val}`);
      // });
      // console.log("FormData value",formData);


      this.menuServices.addNewCategoryItem(formData)
      .subscribe({
        next: (res: any) => {
          if(res){
            // console.log("post response: ", res);

            setTimeout(() => {
              this.addItemForm.reset();
              this.removeAddNotesDiv();
              this.backToItemsDiv();

              // Recall the getItemsDetails method
              this.getItemsDetails();
            }, 1000);

            this.messageService.add({key: 'saveAlert', severity:'success', summary: 'Success', detail: 'Item Added Successfully'});

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

  editItem(id: any){

    // console.log(id);
    this.itemId = id;

    this.menuServices.getItemByItemId(id).subscribe({
      next: (res: any) => {
        if(res) {
          const data = res?.result;
          // console.log(data);

          this.image = data?.image;
          if(this.addItemForm) {
            this.divItems = false;
            this.divAddItems = true;
            this.showSaveBtn = false;
            this.showUpdateBtn = true;
            this.showDeleteBtn = true;
            this.showAddNotesDiv();

            this.addItemForm.patchValue({
              ItemName: data?.name,
              Remarks: data?.remarks,
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
    
  }

  deleteItemById() {
    this.menuServices.deleteItemById(this.itemId).subscribe({
      next: (res: any) => {
        if(res){
          console.log("post response: ", res);

          this.deleteDialogVisible = false;
          setTimeout(() => {
            this.addItemForm.reset();
            this.removeAddNotesDiv();
            this.backToItemsDiv();

            // Recall the getItemsDetails method
            this.getItemsDetails();
          }, 1500);
          this.messageService.add({key: 'saveAlert', severity:'success', summary: 'Success', detail: 'Item Deleted Successfully'});
        }else{
          this.messageService.add({key: 'errorAlert', severity:'error', summary: 'Error', detail: res});
        }
      },
      error: (response: any) => {
        console.log(response);
      },
    });
  }

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
      formData.append('Remarks', this.addItemForm?.value.Remarks);

      this.menuServices.updateItemById(formData, this.itemId)
      .subscribe({
        next: (res: any) => {
          if(res){
            // console.log("post response: ", res);

            setTimeout(() => {
              this.addItemForm.reset();
              this.removeAddNotesDiv();
              this.backToItemsDiv();

              // Recall the getItemsDetails method
              this.getItemsDetails();
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
}
