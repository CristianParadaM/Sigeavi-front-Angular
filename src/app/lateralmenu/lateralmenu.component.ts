import { Component, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserServiceService } from '../services/user-service.service';

@Component({
  selector: 'app-lateralmenu',
  templateUrl: './lateralmenu.component.html',
  styleUrls: ['./lateralmenu.component.css']
})

@Injectable()
export class LateralmenuComponent {

  protected optionActive: number;
  protected optionMiFarms;
  protected optionChiken;
  protected optionSheds;
  protected optionFood;
  protected optionReports;
  protected optionUsers;
  protected optionSettings;
  protected welcomeAgain;
  protected nameUser;
  protected addFarm;

  protected permissions: number[];
  protected isExpanded: boolean;

  protected managementLot;
  protected vaccinationPlan;
  protected mortality;

  protected managementSheep;
  protected spaceSheep;

  protected inventory;
  protected waterConsumed;
  protected weightControl;
  protected foodhistory;

  protected foodReport;
  protected mortalityReport;
  protected vaccinationReport;
  protected costsReport;
  protected magnamentUsers;

  protected title;
  protected titleSecundary;
  protected logoutVisible;
  protected curtainVisibility: boolean;
  protected rol;

  protected isChecked: boolean;

  constructor(private userService: UserServiceService, private router: Router) {
    this.welcomeAgain = "Bienvenido de nuevo";
    this.nameUser = userService.getUserActive();
    this.title = "SISTEMA DE GESTIÓN Y TRAZABILIDAD DE GRANJAS AVICOLAS - SIGEAVI";
    this.titleSecundary = "SIGEAVI";

    this.managementLot = "Gestión de Lotes"
    this.managementSheep = "Gestión Galpones"
    this.optionMiFarms = "Mis Granjas";
    this.optionChiken = "Gallinas";
    this.optionSheds = "Galpones";
    this.optionFood = "Alimentación";
    this.optionReports = "Reportes";
    this.optionUsers = "Usuarios";
    this.optionSettings = "Configuración";
    this.isExpanded = false;
    this.addFarm = "Añadir Granja";
    this.vaccinationPlan = "Plan de Vacunación";
    this.mortality = "Mortalidad";
    this.spaceSheep = "Gestión Espacio";
    this.inventory = "Inventario";
    this.waterConsumed = "Consumo de Agua";
    this.weightControl = "Control de Peso";
    this.foodhistory = "Cons. Alimenticio";
    this.foodReport = "Reporte Alimenticio";
    this.mortalityReport = "Reporte Mortalidad";
    this.vaccinationReport = "Reporte Agua";
    this.costsReport = "Reporte Costos";
    this.magnamentUsers = "Gestión de Usuarios";
    this.optionActive = -1;
    this.permissions = [-1, 0, 0.1];
    this.rol = "Administrador";
    this.isChecked = false;

    window.addEventListener('resize', () => {
      this.isChecked = false;
      this.isExpanded = false;
    });

  }

  logOut() {
    this.userService.logout()
      .then(() => {
        this.router.navigate(['/home/news']);
      })
      .catch();
  }

  changeCurtainVisibility(b) {
    this.curtainVisibility = b;
  }

  getPermission(index): boolean {
    return this.permissions.find(element => element == index) != undefined;
  }

  changeTitle(title: string) {
    this.title = title.toUpperCase();
    this.titleSecundary = title.toUpperCase();
  }

  select(index: number, optionSelected: number, title: string) {
    this.optionActive = index;
    this.isChecked = false;
    this.isExpanded = false;
    if (optionSelected != undefined) {
      this.title = title;
    }
    window.scroll(0,0);
    switch (optionSelected) {
      case -1:
        this.router.navigate([`/menu/news`]);
        break;
      case 0.1:
        this.router.navigate([`/menu/addFarm`]);
        break
      case 1.1:
        this.router.navigate([`/menu/chickens/${1}`]);
        break
      case 1.2:
        this.router.navigate([`/menu/chickens/${2}`]);
        break
      case 1.3:
        this.router.navigate([`/menu/chickens/${3}`]);
        break
      case 1.4:
        this.router.navigate([`/menu/chickens/${4}`]);
        break
      case 2.1:
        this.router.navigate([`/menu/sheeds/${1}`]);
        break
      case 2.2:
        this.router.navigate([`/menu/sheeds/${2}`]);
        break
      case 3.1:
        this.router.navigate([`/menu/food/${1}`]);
        break
      case 3.2:
        this.router.navigate([`/menu/food/${2}`]);
        break
      case 3.3:
        this.router.navigate([`/menu/food/${3}`]);
        break
      case 4.1:
        this.router.navigate([`/menu/foodreport`]);
        break
      case 4.2:
        this.router.navigate([`/menu/mortalityReport`]);
        break
      case 4.3:
        this.router.navigate([`/menu/waterReport`]);
        break
      case 4.4:
        this.router.navigate([`/menu/costsReport`]);
        break
      case 6:
        this.router.navigate([`/menu/configurations`]);
        break

    }
  }

  changeLogoutVisibility() {
    this.logoutVisible = !this.logoutVisible;
  }

  expand(b: boolean) {
    if (window.screenX == 0) {
      this.isChecked = false;
    }
    if (this.isChecked) {
      this.isExpanded = true;
    } else {
      this.isExpanded = b;
    }
    if (this.isExpanded) {
      this.nameUser = this.userService.getUserActive()
    } else {
      this.isChecked = false;
    }
  }

  closeAll(){
    this.isChecked = false;
    this.isExpanded = false;
    if (!this.isChecked) {
      this.isExpanded = false;
    }
  }

  selectFarm(id: number, name: string) {
    this.optionMiFarms = name;
    this.userService.selectFarm(id);
    console.log(this.userService.getPermissions())
    this.userService.getPermissions().forEach(element => {
      if (name == element['farm']) {
        this.permissions = element['permises'];
      }
    });
    this.router.navigate(['/menu/news']);
  }

  print(check){
    console.log(check.checked)
  }
}
