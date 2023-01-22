import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserServiceService } from '../services/user-service.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {

  protected logout;
  protected indexOptions:number;
  
  constructor() {
    this.logout = "Cerrar sesión";
    this.indexOptions = -1;
  }

  openOption(index){
    this.indexOptions = index;
  }

}
