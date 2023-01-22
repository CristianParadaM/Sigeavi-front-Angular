import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {

  protected titleApp: string;
  protected bntRegistryText: string;
  protected btnLoginText: string;
  protected btnContact: string;
  protected btnAboutUs: string;
  protected btnHome: string;
  protected index: number;

  constructor(private router: Router) {
    this.titleApp = "SIGEAVI";
    this.bntRegistryText = "Registrarse";
    this.btnLoginText = "Iniciar sesion";
    this.btnContact = "Contacto";
    this.btnAboutUs = "Sobre Nosotros";
    this.btnHome = "Inicio";
    this.index = 0;
  }
  
  ngOnInit() {
  }

  changeIndex(index: number) {
    this.index = index;
    switch (index) {
      case 0:
        this.router.navigate(['/home/news']);
        break;
      case 1:
        this.router.navigate(['/home/login']);
        break;
      case 2:
        this.router.navigate(['/home/register']);
        break;
    }
  }

  moveScroll(position) {
    window.scroll(0, position);
  }

  getHeightScreen(): number {
    return screen.height;
  }

  s(s){
    console.log(s)
  }
}
