import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserServiceService } from '../services/user-service.service';

@Component({
  selector: 'app-routermenu',
  templateUrl: './routermenu.component.html',
  styleUrls: ['./routermenu.component.css']
})
export class RoutermenuComponent implements OnInit {

  constructor() {}

  ngOnInit(): void {
  }

}
