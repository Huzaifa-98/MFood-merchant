import { Component, OnInit } from '@angular/core';
import { MenuService } from '../services/menu.service';
import { DatePipe } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  AbstractControl,
  FormControl,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexResponsive,
  ApexXAxis,
  ApexLegend,
  ApexFill,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive[];
  xaxis: ApexXAxis;
  legend: ApexLegend;
  fill: ApexFill;
};

@Component({
  selector: 'app-menus',
  templateUrl: './menus.component.html',
  styleUrls: ['./menus.component.css'],
})
export class MenusComponent implements OnInit {
  menu: any[] = [];
  divMenus!: boolean;
  divAddMenus!: boolean;
  addNotesLabel: boolean = true;
  infoDialogVisible: boolean = false;
  deleteDialogVisible: boolean = false;
  showDeleteBtn: boolean = false;
  addNotesDiv: boolean = false;
  showSaveBtn: boolean = true;
  showUpdateBtn: boolean = false;
  menuStartTime: any[] = [];
  menuEndTime: any[] = [];
  rangeBarTime: any[] = [];
  menuDays: any[];
  addMenuForm!: FormGroup;
  editMenuID!: any;
  firstFormGroup: any;
  shopID: any = 3309;

  public chartOptions: Partial<ChartOptions>;
  menuTimings!: any;

  constructor(
    private formBuilder: FormBuilder,
    private menuServices: MenuService,
    private messageService: MessageService
  ) {

    this.menuTimings = [];

    this.chartOptions = {
      series: this.generateSeriesData(),
      chart: {
        type: 'rangeBar',
        height: 400,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      dataLabels: {
        enabled: true,
      },
    };

    this.menuDays = [
      { name: 'Mon', value: 1 },
      { name: 'Tue', value: 2 },
      { name: 'Wed', value: 3 },
      { name: 'Thu', value: 4 },
      { name: 'Fri', value: 5 },
      { name: 'Sat', value: 6 },
      { name: 'Sun', value: 7 },
    ];
  }

  ngOnInit(): void {
    this.getMenusGroup(); //Get All Menu List
    this.divMenus = true;
    this.divAddMenus = false;
    this.fillMenuStartEndTimeArray(); //Start Time and End Time in Add Menu
    this.initForm();
    this.editMenuFromOvrviewCmpnent(); //Route from Overview to Menus to edit menu
  }

  initForm() {
    this.addMenuForm = this.formBuilder.group({
      MenuName: ['', Validators.required],
      Remarks: [''],
      additionalSections: this.formBuilder.array([
        this.formBuilder.group({
          WeekDays: [],
          StartTime: new FormControl('', Validators.required),
          EndTime: new FormControl('', Validators.required),
        }),
      ]), // Initialize additionalSections as a FormArray
    });
    // console.log(this.addMenuForm);
  }

  editMenuFromOvrviewCmpnent() {
    this.menuServices.EditMenuObj().subscribe((val: any) => {
      // console.log(val);

      const valCheck = typeof val === 'number';

      if (valCheck) {
        this.divMenus = false;
        this.divAddMenus = true;
        this.showSaveBtn = false;
        this.showUpdateBtn = true;
        this.showDeleteBtn = true;
        this.showAddNotesDiv();
        this.editMenu(val);
      }
    });
  }

  getRangeCellStyle(
    timing: string,
    sectionIndex: number,
    timeIndex: number
  ): string {
    this.firstFormGroup = (
      this.addMenuForm.get('additionalSections') as FormArray
    ).at(sectionIndex) as FormGroup;
    const startTime = this.firstFormGroup.get('StartTime').value;
    const endTime = this.firstFormGroup.get('EndTime').value;
    const timingIndex = this.convertTimeToIndex(timing);
    const startIdx = startTime ? this.convertTimeToIndex(startTime) : -1;
    const endIdx = endTime ? this.convertTimeToIndex(endTime) : -1;

    // console.log(startIdx, endIdx);

    if (startIdx !== -1 && endIdx !== -1) {
      // Check if start time is PM and end time is AM
      if (startTime.includes('PM') && endTime.includes('AM')) {
        // Highlight if timing is greater than or equal to start time
        // or less than or equal to end time, considering the cyclic nature of time
        if ((timingIndex >= startIdx && timingIndex <= 47) || (timingIndex >= 0 && timingIndex <= endIdx)) {
          return 'orange';
        }
      } else if (
        // Highlight if timing is within the range defined by start and end times
        (timingIndex >= startIdx && timingIndex <= endIdx)
      ) {
        return 'orange';
      }
    }

    return ''; // Return other classes or an empty string based on your needs
  }

  convertTimeToIndex(time: string): number {
    // Extract hours and AM/PM from the time string
    const timeParts = time.match(/(\d+):(\d+) (AM|PM)/);

    if (!timeParts || timeParts.length !== 4) {
      // Handle invalid time format
      console.error('Invalid time format:', time);
      return -1; // or throw an error, depending on your error handling strategy
    }

    const hours = parseInt(timeParts[1], 10);
    const minutes = parseInt(timeParts[2], 10);
    const period = timeParts[3];

    // Convert to 24-hour format
    const hours24 = (hours % 12) + (period.toUpperCase() === 'PM' ? 12 : 0);

    // Calculate the index
    return hours24 * 2 + minutes / 30;
  }

  addMoreDaysAndTimes() {
    const newSection = this.formBuilder.group({
      WeekDays: [],
      StartTime: [''],
      EndTime: [''],
      // addMenuCheckbox: [false]
      // Add other form controls for additional section if needed
    });
    // this.selectedRange = { start: '', end: '' },
    (this.addMenuForm.get('additionalSections') as FormArray).push(newSection);
  }

  get menuDaysTime(): FormArray {
    return this.addMenuForm.controls['additionalSections'] as FormArray;
  }

  removeSection(index: number) {
    const additionalSections = this.addMenuForm.get(
      'additionalSections'
    ) as FormArray;
    additionalSections.removeAt(index);
  }

  menuAddBtnHide(index: number) {
    if (index < 1) {
      return false;
    } else {
      return true;
    }
  }

  fillMenuStartEndTimeArray() {
    for (let hour = 0; hour <= 23; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        // Convert 24-hour format to 12-hour format
        let formattedHour = hour % 12 === 0 ? 12 : hour % 12;

        // Format the hour and minute to display leading zeros
        let formattedMinute = minute === 0 ? '00' : minute;

        // Determine if it's AM or PM
        let period = hour < 12 ? 'AM' : 'PM';

        // Create the time string in the format HH:mm AM/PM
        let timeString = `${formattedHour}:${formattedMinute} ${period}`;

        // Create an object with name and value properties
        let timeObject = {
          name: timeString,
          value: timeString,
        };

        // Push the object into the array
        this.menuStartTime!.push(timeObject);

        this.menuEndTime!.push(timeObject);
        //For Range bar chart
        this.rangeBarTime!.push(timeObject);
      }
    }

    // console.log(this.menuStartTime);
  }

  getFilteredMenu(MenuId: any) {
    // console.log(MenuId);

    const dayMap: any = {
      1: 'Mon',
      2: 'Tue',
      3: 'Wed',
      4: 'Thu',
      5: 'Fri',
      6: 'Sat',
      7: 'Sun',
    };

    // Your original array
    const menuTimingsFiltered = this.menu.filter((x: any) => x.menuId == MenuId)
    // console.log(menuTimings);
    
    const transformedArray: any[] = [];
    menuTimingsFiltered.forEach((timing: any) => {
      // console.log(timing);
      timing.menuTimings.forEach((menuDays: any) => {
        // console.log(day);
        menuDays.menuTimingDays.forEach((day: any) => {
          const dayName = dayMap[day.dayId];
          const existingDay = transformedArray.find((item) => item.Day === dayName);
          const datePipe = new DatePipe('en-US');
          const timingInfo = {
            StartTime: datePipe.transform(menuDays.startTime, 'h:mm a'),
            EndTime: datePipe.transform(menuDays.endTime, 'h:mm a'),
          };
          if (existingDay) {
            existingDay.timing.push(timingInfo);
          } else {
            transformedArray.push({ Day: dayName, timing: [timingInfo] });
          }
        });
      });
    });
    // console.log(transformedArray);
    this.menuTimings = transformedArray

    // After updating menuTimings, regenerate the series data for the chart
    this.chartOptions.series = this.generateSeriesData();
  }

  generateSeriesData() {
    if(this.menuTimings !== null) {
      return this.menuTimings.map((day: any) => {
        // console.log(day);
        return {
          name: day.Day,
          data: day.timing.map((time: any) => {
            const startTime = this.convertTimeStringToDecimal(time.StartTime);
            const endTime = this.convertTimeStringToDecimal(time.EndTime);
            return { x: day.Day, y: [startTime, endTime] };
          }),
        };
      });
    }
  }

  convertTimeStringToDecimal(timeString: any) {
    // Convert time string to decimal representation (e.g., '09:00 AM' to 9.0)
    // You can use libraries like moment.js for more robust time handling
    // console.log(timeString);
    
    const [hours, minutes] = timeString
      .split(':')
      .map((part: any) => parseInt(part, 10));
    const isPM = timeString.includes('PM');
    const decimalTime = hours + (isPM && hours !== 12 ? 12 : 0) + minutes / 60;
    return decimalTime;
  }

  getMenusGroup() {
    this.menuServices.getMenusGroup().subscribe({
      next: (res: any) => {
        // console.log(res);
        const dataObject = res.result;
        this.menu = dataObject;

        // Create a dictionary for quick lookup
        const dayIdToName: any = {};
        this.menuDays.forEach((day: any) => {
          dayIdToName[day.value] = day.name;
        });

        const datePipe = new DatePipe('en-US');

        this.menu.forEach((menuItem) => {
          menuItem.menuTimings.forEach((menuTiming: any) => {
            const dayNames = menuTiming.menuTimingDays
              .map((day: any) => dayIdToName[day.dayId])
              .join(',');
            const startTime = datePipe.transform(
              menuTiming.startTime,
              'h:mm a'
            );
            const endTime = datePipe.transform(menuTiming.endTime, 'h:mm a');
            const timeRange = `${startTime} - ${endTime}`;

            menuTiming.menuHrs = `${dayNames}: ${timeRange}`;
            // console.log(`${dayNames}: ${timeRange}`);
          });
        });

        this.menu.map((menuTime: any) => {
          menuTime.menuDaysHrs = '';

          menuTime.menuTimings.forEach((menuDetails: any, index: number) => {
            menuTime.menuDaysHrs += `${menuDetails.menuHrs}`;

            if (index < menuTime.menuTimings.length - 1) {
              menuTime.menuDaysHrs += ', ';
            }
          });
        });

        this.menu.map((menuCtg: any) => {
          menuCtg.menuCategory = '';

          menuCtg.categoryMappings.forEach((ctgName: any, index: any) => {
            menuCtg.menuCategory += `${ctgName.categoryName}`;

            if (index < menuCtg.categoryMappings.length - 1) {
              menuCtg.menuCategory += ', ';
            }
          });
        });

        // this.selectedMenu = this.menu[0].menuId;

        // console.log(this.menu);
        // Iterate through CategoryGroup array
        // this.menu = this.menu.map((categoryGroup: any) => {
        //   // Initialize menuTimings property
        //   // categoryGroup.menuHrs = '';
        //   console.log(categoryGroup);

        //   // Iterate through menuTimings array
        //   categoryGroup.menuTimings.forEach(
        //     (additionalSection: any, index: number) => {

        //       additionalSection.menuTimingDays.forEach((menuDays: any) => {
        //         console.log(menuDays);

        //       });

        //       // // Split the DaysId string into an array
        //       // const daysArray = additionalSection.daysId.split(',');

        //       // // Map each value to the corresponding day name
        //       // const dayNames = daysArray.map(
        //       //   (dayValue: any) => daysLookup[dayValue]
        //       // );

        //       // // Join the day names with commas
        //       // const dayNamesString = dayNames.join(', ');

        //       // // Format the string as specified
        //       // categoryGroup.menuTimings += `${dayNamesString}: ${additionalSection.startTime} - ${additionalSection.endTime}`;

        //       // Add a comma after each section except the last one
        //       if (index < categoryGroup.additionalSections.length - 1) {
        //         categoryGroup.menuTimings += ', ';
        //       }
        //     }
        //   );

        //   return categoryGroup;
        // });

        // console.log(this.menu);
      },
      error: (response: any) => {
        console.log(response);
      },
    });
  }

  ShowNewMenus() {
    this.divMenus = false;
    this.divAddMenus = true;
    this.showDeleteBtn = false;
  }

  confirmDelete() {
    this.deleteDialogVisible = true;
  }

  CnfrmbackToMenuDiv() {
    this.infoDialogVisible = true;
  }

  backToMenuDiv() {
    this.removeAddNotesDiv();
    this.divMenus = true;
    this.divAddMenus = false;
    this.showSaveBtn = true;
    this.showUpdateBtn = false;
    this.infoDialogVisible = false;
    this.deleteDialogVisible = false;
    this.showDeleteBtn = false;

    const additionalSections = this.addMenuForm.get(
      'additionalSections'
    ) as FormArray;

    // Remove all sections except the first one
    while (additionalSections.length > 1) {
      additionalSections.removeAt(1);
    }

    // Reset the form
    this.addMenuForm.reset();
  }

  showAddNotesDiv() {
    this.addNotesLabel = false;
    this.addNotesDiv = true;
  }

  removeAddNotesDiv() {
    this.addNotesLabel = true;
    this.addNotesDiv = false;
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

  transformFormValue(formValue: any): any {
    const transformedObject = {
      name: formValue.MenuName,
      shopId: this.shopID,
      remarks: formValue.Remarks,
      menuTimings: formValue.additionalSections.map((section: any) => {
        const weekDays = section.WeekDays.map((day: boolean, index: number) => {
          return {
            dayId: day ? day : '',
          };
        }).filter(Boolean);

        // const startDateTimeObj = new Date(section.StartTime);
        // const endDateTimeObj = new Date(section.EndTime);
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(currentDate.getDate()).padStart(2, '0');

        const parsedStartDateTime = new Date(
          `${year}-${month}-${day} ${section.StartTime}`
        );
        const parsedEndDateTime = new Date(
          `${year}-${month}-${day} ${section.EndTime}`
        );

        const datePipe = new DatePipe('en-US');

        const formattedStartTime = datePipe.transform(
          parsedStartDateTime,
          'yyyy-MM-dd h.mm a'
        );
        const formattedEndTime = datePipe.transform(
          parsedEndDateTime,
          'yyyy-MM-dd h.mm a'
        );
        return {
          startTime: formattedStartTime,
          endTime: formattedEndTime,
          menuTimingDays: weekDays,
        };
      }),
    };

    return transformedObject;
  }

  ///////Setting object for update, mapping menuTimingsId in menuTimings object
  updateTransformFormValue(formValue: any): any {
    const transformedObject = {
      name: formValue.MenuName,
      shopId: this.shopID,
      remarks: formValue.Remarks,
      menuTimings: formValue.additionalSections.map((section: any) => {
        const weekDays = section.WeekDays.map((day: boolean, index: number) => {
          return {
            dayId: day ? day : '',
          };
        }).filter(Boolean);

        // const startDateTimeObj = new Date(section.StartTime);
        // const endDateTimeObj = new Date(section.EndTime);
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(currentDate.getDate()).padStart(2, '0');

        const parsedStartDateTime = new Date(
          `${year}-${month}-${day} ${section.StartTime}`
        );
        const parsedEndDateTime = new Date(
          `${year}-${month}-${day} ${section.EndTime}`
        );

        const datePipe = new DatePipe('en-US');

        const formattedStartTime = datePipe.transform(
          parsedStartDateTime,
          'yyyy-MM-dd h.mm a'
        );
        const formattedEndTime = datePipe.transform(
          parsedEndDateTime,
          'yyyy-MM-dd h.mm a'
        );
        return {
          menuTimingId: section.menuTimingId,
          startTime: formattedStartTime,
          endTime: formattedEndTime,
          menuTimingDays: weekDays,
        };
      }),
    };

    return transformedObject;
  }

  ////////// Checking all required fields on submit values
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

  saveAddMenus() {
    if (this.addMenuForm.valid) {
      const obj = this.transformFormValue(this.addMenuForm.value);
      // console.log(obj);

      this.menuServices.addNewMenus(obj).subscribe({
        next: (res: any) => {
          if (res) {
            // console.log('post response: ', res);

            setTimeout(() => {
              this.addMenuForm.reset();
              this.removeAddNotesDiv();
              this.backToMenuDiv(); // Hide divAddCtgry and show divCtgry

              // Recall the getCategoriesDetail method
              this.getMenusGroup();
            }, 1000);

            this.messageService.add({
              key: 'saveAlert',
              severity: 'success',
              summary: 'Success',
              detail: 'Menu Saved Successfully',
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

      this.addMenuForm.reset();
    } else {
      this.validateAllFormFields(this.addMenuForm);
      this.messageService.add({
        key: 'errorAlert',
        severity: 'error',
        summary: 'Error',
        detail: 'Fill the fields first!',
      });
    }
    // console.log(this.addMenuForm.value);
  }

  ///////////////////// Edit Menu Form ////////////////////////

  editMenu(id: any) {
    // console.log(id);

    this.menuServices.GetMenuByMenuId(id).subscribe({
      next: (res: any) => {
        if (res) {
          const data = res?.result[0];
          // console.log(data);

          if (this.addMenuForm) {
            this.divMenus = false;
            this.divAddMenus = true;
            this.showSaveBtn = false;
            this.showUpdateBtn = true;
            this.showDeleteBtn = true;
            this.showAddNotesDiv();

            this.addMenuForm.patchValue({
              MenuName: data?.name,
              Remarks: data?.remarks,
            });
            this.editMenuID = data?.menuId;
            // this.editMenuShopID = data?.shopId;

            // Clear existing additionalSections
            const additionalSections = this.addMenuForm.get(
              'additionalSections'
            ) as FormArray;
            additionalSections.clear();

            data?.menuTimings?.forEach((section: any) => {
              const datePipe = new DatePipe('en-US');

              const daysId = section.menuTimingDays.map(
                (day: any) => day.dayId
              );
              const startTime = datePipe.transform(section.startTime, 'h:mm a');
              const endTime = datePipe.transform(section.endTime, 'h:mm a');

              const newSection = this.formBuilder.group({
                menuTimingId: section.menuTimingId,
                WeekDays: [daysId],
                StartTime: startTime,
                EndTime: endTime,
              });

              // Push the new section to the additionalSections form array
              additionalSections.push(newSection);
            });
          }
        }
      },
      error: (response: any) => {
        console.log(response);
      },
    });
  }

  //////////// For Update Menu /////////////////

  saveEditMenus() {
    if (this.addMenuForm.valid) {
      const obj = this.updateTransformFormValue(this.addMenuForm.value);
      // console.log(this.editMenuID);
      // console.log(obj);

      this.menuServices.updateMenus(obj, this.editMenuID).subscribe({
        next: (res: any) => {
          if (res) {
            // console.log('post response: ', res);

            setTimeout(() => {
              this.addMenuForm.reset();
              this.removeAddNotesDiv();
              this.backToMenuDiv(); // Hide divAddCtgry and show divCtgry

              // Recall the getCategoriesDetail method
              this.getMenusGroup();
            }, 1000);

            this.messageService.add({
              key: 'saveAlert',
              severity: 'success',
              summary: 'Success',
              detail: 'Menu Updated Successfully',
            });
          } else {
            this.messageService.add({
              key: 'errorAlert',
              severity: 'error',
              summary: 'Error',
              detail: res,
            });
          }

          this.addMenuForm.reset();
        },
        error: (response: any) => {
          console.log(response);
        },
      });
    } else {
      this.validateAllFormFields(this.addMenuForm);
      this.messageService.add({
        key: 'errorAlert',
        severity: 'error',
        summary: 'Error',
        detail: 'Fill the fields first!',
      });
    }
  }

  ////////// For Delete Menu ///////////
  deleteMenuById() {
    this.menuServices.deleteMenuById(this.editMenuID).subscribe({
      next: (res: any) => {
        if (res) {
          // console.log('post response: ', res);

          this.deleteDialogVisible = false;
          setTimeout(() => {
            this.addMenuForm.reset();
            this.removeAddNotesDiv();
            this.backToMenuDiv(); // Hide divAddCtgry and show divCtgry

            // Recall the getMenusGroup method
            this.getMenusGroup();
          }, 1500);

          this.messageService.add({
            key: 'saveAlert',
            severity: 'success',
            summary: 'Success',
            detail: 'Menu Deleted Successfully',
          });
        } else {
          this.messageService.add({
            key: 'errorAlert',
            severity: 'error',
            summary: 'Error',
            detail: res,
          });
        }

        this.addMenuForm.reset();
      },
      error: (response: any) => {
        console.log(response);
      },
    });
  }
}
