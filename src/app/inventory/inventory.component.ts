import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Food } from '../food.model';
import { FoodHistory } from '../foodhistory.model';
import { UserServiceService } from '../services/user-service.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {

  protected subtitle;
  protected paragraph1;
  protected paragraph2;
  protected paragraph3;

  protected codeFood;
  protected nameFood;
  protected markFood;
  protected quantyFood;
  protected weightFood;

  protected add;
  protected search;

  protected newFood;
  protected code;
  protected placeholdercode;
  protected name;
  protected placeholdername;
  protected mark;
  protected placeholdermark;
  protected price;
  protected priceNumber;
  protected quanty;
  protected quantyNumber;
  protected weight;
  protected weightNumber;
  protected cancel;
  protected save;

  protected foodsInventoryO: FoodHistory[];
  protected foodsInventory: FoodHistory[];
  protected searchValues: FoodHistory[];
  protected isSearch;

  protected back;
  protected next;
  protected countPages: number[];
  protected selected;
  protected isAddFood = false;
  protected formAddFood: FormGroup;

  constructor(private formBuilder: FormBuilder, private userService: UserServiceService, private route: Router) {
    this.subtitle = "¿Cómo funciona?";
    this.paragraph1 = "A continuación podrás observar una lista de la cantidad de alimentos totales que tienes en tu granja.";
    this.paragraph2 = "Selecciona un alimento de la tabla para ver detalles del mismo, también podrás añadir nuevos alimentos.";
    this.paragraph3 = "Recuerda que si el alimento que vas a ingresar ya lo tienes registrado pero tiene diferente precio, SIGEAVI lo asignará automáticamente a un nuevo inventario  para llevar un mejor control de costos de tu granja.";
    this.nameFood = "Nombre del Alimento";
    this.markFood = "Marca del Alimento";
    this.quantyFood = "Cantidad";
    this.add = "Agregar";
    this.search = "Buscar Alimento";
    this.codeFood = "Código del Alimento"
    this.weightFood = "Peso del Alimento"

    this.newFood = "Nuevo Alimento";
    this.code = "Código";
    this.placeholdercode = "Digite el código del producto";
    this.name = "Nombre";
    this.placeholdername = "Escoja o registre un nombre";
    this.mark = "Marca";
    this.placeholdermark = "Escoja o registre una marca";
    this.price = "Precio";
    this.priceNumber = 0;
    this.quanty = "Cantidad";
    this.quantyNumber = 0;
    this.weight = "Peso";
    this.weightNumber = 0;
    this.save = "Guardar";
    this.cancel = "Cancelar";

    this.back = "<";
    this.next = ">";
    this.selected = 0;
  }

  ngOnInit(): void {
    this.init();
    this.formAddFood = this.formBuilder.group({
      code: ['', [
        Validators.required
      ]],
      name: ['', [
        Validators.required
      ]],
      mark: ['', [
        Validators.required
      ]],
      price: ['0', [
        Validators.required
      ]],
      quanty: ['0', [
        Validators.required
      ]],
      weight: ['0', [
        Validators.required
      ]],
    });
  }

  init() {
    this.userService.updateFoods().subscribe(
      res => {
        let foodHistory = [];
        for (let i = 0; i < res['length']; i++) {
          foodHistory.push(new FoodHistory(res[i]['id_food'], res[i]['name'], res[i]['mark'], res[i]['weight'], res[i]['cantidad']));
        }
        this.userService.setfoodHistory(foodHistory);
        this.foodsInventoryO = foodHistory;
        let j = this.foodsInventoryO.length / 10;
        this.countPages = [];
        for (let index = 0; index < (j >= 5 ? 5 : j); index++) {
          this.countPages.push(index + 1);
        }
        this.foodsInventory = [];
        if (this.isSearch) {
          this.insertFoodBySearch();
        } else {
          this.insertFoodByPage();
        }
      }
    );
  }

  private insertFoodBySearch() {
    let count = 0;
    this.calculatePages(this.searchValues.length / 10);
    for (let i = 10 * this.selected; i < this.searchValues.length; i++) {
      this.foodsInventory.push(this.searchValues[i]);
      if (++count == 10) {
        break;
      }
    }
  }

  private calculatePages(totalPages: number) {
    this.countPages = [];
    for (let index = 0; index < (totalPages >= 5 ? 5 : totalPages); index++) {
      this.countPages.push(index + 1);
    }
  }

  private insertFoodByPage() {
    let count = 0;
    this.calculatePages(this.foodsInventoryO.length / 10);
    for (let i = 10 * this.selected; i < this.foodsInventoryO.length; i++) {
      this.foodsInventory.push(this.foodsInventoryO[i]);
      if (++count == 10) {
        break;
      }
    }
  }

  order(orderBy) {
    switch (orderBy) {
      case 0:
        this.foodsInventory = this.foodsInventory.sort((a: Food, b: Food) => {
          return a.name > b.name ? 1 : -1;
        });
        break;
      case 1:
        this.foodsInventory = this.foodsInventory.sort((a: Food, b: Food) => {
          return a.mark > b.mark ? 1 : -1;
        });
        break;
      case 2:
        this.foodsInventory = this.foodsInventory.sort((a: Food, b: Food) => {
          return a.quanty - b.quanty;
        });
        break;
    }
  }

  filtre(pattern) {
    this.selected = 0;
    this.isSearch = pattern.length > 0;
    this.searchValues = [];
    this.foodsInventoryO.forEach(item => {
      if (item.code.toString().includes(pattern)) {
        this.searchValues.push(item);
      } else if (item.name.toString().includes(pattern)) {
        this.searchValues.push(item);
      } else if (item.quanty.toString().includes(pattern)) {
        this.searchValues.push(item);
      } else if (item.mark.toString().includes(pattern)) {
        this.searchValues.push(item);
      }
    })
    this.init();
  }

  selectControl(i) {
    this.selected = i;
    this.init();
  }

  backControl() {
    this.selected -= this.selected > 0 ? 1 : 0;
    this.init();
  }

  nextControl() {
    this.selected += this.selected < this.countPages.length - 1 ? 1 : 0;
    this.init();
  }

  addFood() {
    this.isAddFood = true;
  }

  cancelForm() {
    this.isAddFood = false;
  }

  saveForm() {
    this.isAddFood = false;
    this.userService.existFood(this.formAddFood.value.code).subscribe((res: Array<Object>) => {
      if (res.length > 0) {
        this.addInventory(this.formAddFood.value.price, this.formAddFood.value.code, this.formAddFood.value.quanty).subscribe((res3: boolean) => {
          if (res3) {
            Swal.fire({
              icon: 'success',
              text: 'Alimento actualizado exitosamente',
              showConfirmButton: false,
              timer: 1500
            });
            this.init();
          } else {
            Swal.fire({
              icon: 'error',
              text: 'Ocurrio algun error',
              showConfirmButton: false,
              timer: 1500
            });
          }
        });
      } else {
        this.userService.createFood(this.formAddFood.value.code, this.formAddFood.value.name, this.formAddFood.value.mark, this.formAddFood.value.weight).subscribe(res2 => {
          if (res2) {
            this.addInventory(this.formAddFood.value.price, this.formAddFood.value.code, this.formAddFood.value.quanty).subscribe((res3: boolean) => {
              if (res3) {
                Swal.fire({
                  icon: 'success',
                  text: 'Alimento creado exitosamente',
                  showConfirmButton: false,
                  timer: 1500
                });
                this.init();
              } else {
                Swal.fire({
                  icon: 'error',
                  text: 'Ocurrio algun error',
                  showConfirmButton: false,
                  timer: 1500
                });
              }
            });
          }
        });
      }
    });
  }

  private addInventory(price, id, amount) {
    return this.userService.addInventory(price, id, amount);
  }

  select(name, code) {
    this.userService.setCodeInventory(code);
    this.userService.getFoodInventoryByCode().subscribe(
      res => {
        let foodInventory: Food[] = [];
        for (let i = 0; i < res['length']; i++) {
          let date = new Date(res[i]['date'].split('T')[0]).toLocaleDateString('fr-FR');
          foodInventory.push(new Food(res[i]['id_food'], res[i]['name'], res[i]['mark'], res[i]['price'], res[i]['weight'], res[i]['cantidad'], res[i]['id_food_inventory'], date))
        }
        this.userService.setFoodInventory(foodInventory);
        this.route.navigate(['menu/food/1', name]);
      }
    );
  }

}
