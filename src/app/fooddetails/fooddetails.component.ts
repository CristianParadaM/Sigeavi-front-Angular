import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Food } from '../food.model';
import { UserServiceService } from '../services/user-service.service';

@Component({
  selector: 'app-fooddetails',
  templateUrl: './fooddetails.component.html',
  styleUrls: ['./fooddetails.component.css']
})

export class FooddetailsComponent implements OnInit {

  protected codeFood;
  protected nameFood;
  protected markFood;
  protected weightFood;
  protected priceFood;
  protected quantyFood;
  protected inventoryFood;
  protected dateFood;
  protected edit;
  protected search;
  protected foodSearched;
  protected nameFoodSearched;

  protected foodsInventoryO: Food[];
  protected foodsInventory: Food[];

  protected back;
  protected next;
  protected countPages: number[];
  protected selected;
  protected isEdit;
  protected isSearch;
  protected searchValues: Food[];

  protected quantyModified: object[];

  constructor(private userService: UserServiceService, private route: Router, private routerActive: ActivatedRoute) {
    this.codeFood = "Código"
    this.nameFood = "Nombre";
    this.markFood = "Marca";
    this.weightFood = "Peso";
    this.priceFood = "Precio";
    this.quantyFood = "Cantidad";
    this.inventoryFood = "Inventario";
    this.dateFood = "Fecha de Ingreso";
    this.edit = "Editar";
    this.search = "Buscar un Alimento";
    this.foodSearched = "Historial de: ";
    this.nameFoodSearched = this.routerActive.snapshot.params['name'];
    this.back = "<";
    this.next = ">";
    this.selected = 0;
  }

  init() {
    this.userService.getFoodInventoryByCode().subscribe(res => {
      this.foodsInventoryO = [];
      this.quantyModified = [];
      console.log(res)
      for (let i = 0; i < res['length']; i++) {
        let date = new Date(res[i]['date'].split('T')[0]).toLocaleDateString('fr-FR');
        this.foodsInventoryO.push(new Food(res[i]['id_food'], res[i]['name'], res[i]['mark'], res[i]['price'], res[i]['weight'], res[i]['cantidad'], res[i]['id_food_inventory'], date))
      }
      this.foodsInventory = [];
      if (this.isSearch) {
        this.insertFoodBySearch();
      } else {
        this.insertFoodByPage();
      }
    });
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

  private insertFoodByPage() {
    let count = 0;
    this.calculatePages(this.foodsInventoryO.length / 10);
    for (let i = 10 * this.selected; i < this.foodsInventoryO.length; i++) {
      this.foodsInventory.push(new Food(this.foodsInventoryO[i].code, this.foodsInventoryO[i].name, this.foodsInventoryO[i].mark, this.foodsInventoryO[i].price, this.foodsInventoryO[i].weight, this.foodsInventoryO[i].quanty, this.foodsInventoryO[i].inventory, this.foodsInventoryO[i].date));
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

  backControl() {
    this.selected -= this.selected > 0 ? 1 : 0;
    this.init();
  }

  order(orderBy) {
    switch (orderBy) {
      case 0:
        this.foodsInventory = this.foodsInventory.sort((a: Food, b: Food) => {
          return a.code - b.code;
        });
        break;
      case 1:
        this.foodsInventory = this.foodsInventory.sort((a: Food, b: Food) => {
          return a.name > b.name ? 1 : -1;
        });
        break;
      case 2:
        this.foodsInventory = this.foodsInventory.sort((a: Food, b: Food) => {
          return a.mark > b.mark ? 1 : -1;
        });
        break;
      case 3:
        this.foodsInventory = this.foodsInventory.sort((a: Food, b: Food) => {
          return a.price - b.price;
        });
        break;
      case 4:
        this.foodsInventory = this.foodsInventory.sort((a: Food, b: Food) => {
          return a.quanty - b.quanty;
        });
        break;
      case 5:
        this.foodsInventory = this.foodsInventory.sort((a: Food, b: Food) => {
          return a.inventory > b.inventory ? 1 : -1;
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
      } else if (item.price.toString().includes(pattern)) {
        this.searchValues.push(item);
      } else if (item.quanty.toString().includes(pattern)) {
        this.searchValues.push(item);
      } else if (item.inventory.toString().includes(pattern)) {
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

  nextControl() {
    this.selected += this.selected < this.countPages.length - 1 ? 1 : 0;
    this.init();
  }

  ngOnInit(): void {
    this.init();
  }

  backInventory() {
    this.route.navigate(['menu/food/1']);
  }

  add(quanty, inventory) {
    this.quantyModified.push({
      quanty, inventory
    })
  }

  async editInventory() {
    this.isEdit = !this.isEdit;
    if (!this.isEdit) {
      console.log(this.quantyModified)
      for (let i = 0; i < this.quantyModified.length; i++) {
        this.userService.updateQuantyFood(this.quantyModified[i]['quanty'], this.quantyModified[i]['inventory']).subscribe((res) => {
          if (res) {
            Swal.fire({
              icon: 'success',
              text: 'Cambios Guardados exitosamente',
              showConfirmButton: false,
              timer: 1500
            });
            this.init();
          } else {
            Swal.fire({
              icon: 'error',
              text: 'Ha ocurrido un error',
              showConfirmButton: false,
              timer: 1500
            });
          }
        });
      }

    }
  }

}
