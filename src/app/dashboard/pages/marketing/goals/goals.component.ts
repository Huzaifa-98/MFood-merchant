import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-goals',
  templateUrl: './goals.component.html',
  styleUrls: ['./goals.component.css']
})
export class GoalsComponent implements OnInit {
  parameterValue: any;
  constructor(private activatedRoute: ActivatedRoute, private location: Location) { 
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(param => {
      this.parameterValue = param['goal'];
      console.log(this.parameterValue);
    })
  }

  goBack() {
    this.location.back();
  }

}
