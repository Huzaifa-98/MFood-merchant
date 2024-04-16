import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  ordersAll: any[] = [];
  ordersUnfulfilled: any[] = [];
  minDate!: any;
  maxDate!: any;
  date4!: any;

  constructor() { }

  ngOnInit(): void {
    this.ordersAll = [
      {
        "itemId":79195,
        "itemName":"Chicken Fried Rice",
        "baseAmount":450,
        "menuImage":"http://172.16.100.151:8048/api/Menu/getImage/8f5fc3c5-a935-4d12-96c7-c9b1eb0e8427.jpg",
        "categoryName":"Rice",
        "menuName":"Dinner"
      },
      {
        "itemId":79195,
        "itemName":"Chicken Fried Rice",
        "baseAmount":450,
        "menuImage":"http://172.16.100.151:8048/api/Menu/getImage/8f5fc3c5-a935-4d12-96c7-c9b1eb0e8427.jpg",
        "categoryName":"Rice",
        "menuName":"Dinner"
      },
      {
        "itemId":79195,
        "itemName":"Chicken Fried Rice",
        "baseAmount":450,
        "menuImage":"http://172.16.100.151:8048/api/Menu/getImage/8f5fc3c5-a935-4d12-96c7-c9b1eb0e8427.jpg",
        "categoryName":"Rice",
        "menuName":"Dinner"
      }
    ]
  }

}
