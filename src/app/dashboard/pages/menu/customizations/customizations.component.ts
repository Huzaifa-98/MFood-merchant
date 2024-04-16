import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-customizations',
  templateUrl: './customizations.component.html',
  styleUrls: ['./customizations.component.css']
})
export class CustomizationsComponent implements OnInit {

  addCustomizationForm!: FormGroup;
  showCustomization: boolean = false;
  createDialogVisible: boolean = false;
  customization: any[] = []

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.customization = [
      {
        name: 'Choose your drink',
        count: 13,
        notes: 'test123'
      },
      {
        name: 'Choose your side',
        count: 2,
        notes: 'test notes'
      },
      {
        name: 'Choose your side',
        count: 5,
        notes: ''
      },
      {
        name: 'Choose your drink',
        count: 8,
        notes: ''
      },
      {
        name: 'Choose your side',
        count: 2,
        notes: ''
      },
      {
        name: 'Choose your side',
        count: 5,
        notes: ''
      },
      {
        name: 'Choose your drink',
        count: 8,
        notes: 'notes for drink'
      }
    ]


    this.addCustomizationForm = this.formBuilder.group({
      CustomizationName: ['', Validators.required],
      Notes: ['']
    });

  }

  customizationDetails() {
    this.showCustomization = true;
  }

  backToMain() {
    this.showCustomization = false;
  }

  addCustomization() {
    this.createDialogVisible = true;
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
