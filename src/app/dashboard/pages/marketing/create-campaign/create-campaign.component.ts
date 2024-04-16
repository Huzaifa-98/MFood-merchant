import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-campaign',
  templateUrl: './create-campaign.component.html',
  styleUrls: ['./create-campaign.component.css']
})
export class CreateCampaignComponent implements OnInit {
  responsiveOptions!: any[];
  carouselItems:any;
  isLoading:boolean = false;

  constructor(private router: Router, private route: ActivatedRoute ) { }

  ngOnInit(): void {

    this.carouselItems = [
      {
        imageUrl: 'https://d1ralsognjng37.cloudfront.net/ec69f56a-6051-4cca-88b4-b22b33175932.webp',
        title: 'Item 1',
        description: 'Description for Item 1'
      },
      {
        imageUrl: 'https://d1ralsognjng37.cloudfront.net/ec69f56a-6051-4cca-88b4-b22b33175932.webp',
        title: 'Item 2',
        description: 'Description for Item 2'
      },
      {
        imageUrl: 'https://d1ralsognjng37.cloudfront.net/ec69f56a-6051-4cca-88b4-b22b33175932.webp',
        title: 'Item 3',
        description: 'Description for Item 3'
      },
      // Add more items as needed
    ];

    this.responsiveOptions = [
      {
          breakpoint: '1199px',
          numVisible: 1,
          numScroll: 1
      },
      {
          breakpoint: '991px',
          numVisible: 2,
          numScroll: 1
      },
      {
          breakpoint: '767px',
          numVisible: 1,
          numScroll: 1
      }
  ];

  }

  navigateToGoal(){
    this.router.navigate(['goals', 1], {relativeTo : this.route})
  }


}
