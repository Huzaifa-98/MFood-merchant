import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(public router: Router, private activatedRoute: ActivatedRoute) { 
  }

  navbarFixed:boolean = false;
  isActive: boolean = true;
  @HostListener('window:scroll',['$event']) onscroll(){
    if(window.scrollY > 0){
      this.navbarFixed =true;
    }else{
      this.navbarFixed= false;
    }
  } 
  ngOnInit(): void {
  }
 

  navigateToSignup(){
    this.router.navigate(['/authentication/login'])
  }
  


}
