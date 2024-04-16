import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router) { }
  
  selected!: any;
  isCountryActive: boolean = false;
  ngOnInit(): void {
    this.selected = 'PK'
  }

  // Handle Email or Phone Validation 
  handleEmailOrPhone(param: string) {
    if (param[1]) {
      const isNumberCheck = parseInt(param[1]);
      if (!isNaN(isNumberCheck)) {
        this.isCountryActive = true;
      }
    }
    else {
      this.isCountryActive = false;
    }
  }


  naviageteTo(){
    this.router.navigate(["authentication/otp"]);
  }

}
