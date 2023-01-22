import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as AOS from 'aos';
import { UserServiceService } from './services/user-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{
  title = 'Avicola';
  
  constructor(){
    AOS.init();
    window.addEventListener('load',AOS.refresh);
  }

  ngOnInit(): void {
  }
}