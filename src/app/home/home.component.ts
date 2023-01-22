import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  protected visibilityIndex: number;

  constructor() {
    this.visibilityIndex = 0;
  }

  changeVisibilityIndex(index: number) {
    this.visibilityIndex = index;
  }

  ngOnInit(): void {
  }

}
