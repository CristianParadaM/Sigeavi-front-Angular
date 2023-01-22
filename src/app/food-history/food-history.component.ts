import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Lot } from '../lot.model';
import { UserServiceService } from '../services/user-service.service';

@Component({
  selector: 'app-food-history',
  templateUrl: './food-history.component.html',
  styleUrls: ['./food-history.component.css']
})
export class FoodHistoryComponent implements OnInit {

  protected subtitle;
  protected lot;
  protected registerMortality;
  protected searchLot;
  protected kills;
  protected killsNumber;
  protected date;
  protected dateValue;
  protected registerStatus;
  protected registerStatusTrue;
  protected save;
  protected footer;
  protected lotsOriginal: Lot[];
  protected foodsInventory: object[];
  protected lots: Lot[];
  protected history: object[];
  protected selectedLot;
  protected selectedLots: number[];
  protected lastDates: string[];
  protected isRegistred;
  protected formFood;

  constructor(private userService: UserServiceService, private formBuilder: FormBuilder) {
    this.subtitle = "Registro de consumo alimenticio de las aves";
    this.lot = "Lote";
    this.registerMortality = "Registro de Consumo Alimenticio";
    this.searchLot = "Buscar Lote";
    this.date = "Fecha: ";
    let date = new Date(Date.now());
    this.dateValue = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    this.kills = "Muertes";
    this.killsNumber = 0;
    this.registerStatusTrue = "Consumo Alimenticio ya registrado";
    this.registerStatus = "Consumo Alimenticio aún no registrado";
    this.save = "Guardar";
    this.footer = "SIGEAVI te recomienda llevar a diario un control de consumo alimenticio de las aves para tener un mayor control sobre su calidad de vida.";
    this.selectedLot = 0;
  }

  ngOnInit(): void {
    this.lotsOriginal = this.userService.getLots();
    this.lots = this.lotsOriginal;
    if (this.lots.length > 0) {
      this.selectedLot = this.lots[0].id;
    }
    this.selectedLots = [1];
    this.foodsInventory = [];
    this.formFood = this.formBuilder.group({
      quanty: ['', [
        Validators.required
      ]],
      id_food: ['', [
        Validators.required
      ]]
    });
    for (let i = 1; i < this.lots.length; i++) {
      this.selectedLots.push(-1);
    }
    this.select(this.selectedLot, 0);
  }

  filter(pattern: string) {
    this.lots = [];
    this.lotsOriginal.forEach(element => {
      if (element.lot.includes(pattern)) {
        this.lots.push(element);
      }
    });
  }

  select(id: number, i: number) {
    for (let i = 0; i < this.selectedLots.length; i++) {
      this.selectedLots[i] = -1;
    }
    this.selectedLot = id;
    this.selectedLots[i] = 1;
    this.updateInfo();
  }

  saveChanges() {
    if (this.verifyQuanty(this.formFood.value.quanty, this.formFood.value.id_food)) {
      this.userService.updateFoodConsum(this.selectedLot, this.formFood.value.quanty, this.formFood.value.id_food).subscribe(
        (x) => {
          if (x) {
            Swal.fire({
              icon: 'success',
              text: 'Consumo Alimenticio Registrado',
              showConfirmButton: false,
              timer: 1500
            });
          } else {
            Swal.fire({
              icon: 'error',
              text: 'Ha ocurrido un error',
              showConfirmButton: false,
              timer: 1500
            });
          }
          this.updateInfo();
        }, err => console.log(err)
      );
    }else{
      Swal.fire({
        icon: 'error',
        text: 'No hay suficiente cantidad de este alimento',
        footer: 'Regista mas cantidad de este alimento en la opción Inventario',
      });
    }
  }
  verifyQuanty(quanty: any, id_food: any):boolean {
    for (let i = 0; i < this.foodsInventory.length; i++) {
      if (this.foodsInventory[i]['id'] == id_food) {
        return quanty < this.foodsInventory[i]['quanty'];
      }
    }
    return true;
  }

  private updateInfo() {
    this.userService.getFoodInventory().subscribe(
      (res: Array<Object>) => {
        this.foodsInventory = [];
        for (let i = 0; i < res.length; i++) {
          this.foodsInventory.push({
            id: res[i]['id_food'],
            name: res[i]['name'],
            mark: res[i]['mark'],
            quanty: res[i]['cantidad']
          });
        }
      }
    );
    this.userService.getFoodConsumHistory(this.selectedLot).subscribe(
      (res: Array<object>) => {
        this.history = [];
        console.log(res)
        for (let i = 0; i < res.length; i++) {
          this.history.push({
            date: res[i]['date'],
            consum: res[i]['cantidad'],
            product: res[i]['name'] + ' / ' + res[i]['mark'],
            inventory: 'I-'+res[i]['idInventory'], 
            lot: 'L-'+res[i]['lotNumber']
          });
        }
      }
    );
  }
}
