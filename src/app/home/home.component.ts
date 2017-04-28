import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
searchVal ="hello";


  constructor() {
console.log(this.searchVal);

   }
  search(){
this.searchVal= "greeting";
    console.log(this.searchVal);
  }




  ngOnInit() {
  }

}
