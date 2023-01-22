import { Component, OnInit } from '@angular/core';
import { initializeApp } from '@angular/fire/app';
import Swal from 'sweetalert2';
import { Farm } from '../farm.model';
import { UserServiceService } from '../services/user-service.service';

@Component({
  selector: 'app-addfarm',
  templateUrl: './addfarm.component.html',
  styleUrls: ['./addfarm.component.css']
})
export default class AddfarmComponent implements OnInit {

  protected phrase;
  protected subtitle;
  protected name;
  protected state;
  protected quantyusers;

  protected add;
  protected edit;
  protected save;
  protected start;
  protected farms: Farm[];
  protected farmsO: Farm[];

  protected isEditable: boolean;
  protected preDeletedFarm;

  constructor(private userService: UserServiceService) {
    this.phrase = "A SIGEAVI le complace poder ayudarte con la gestión de tus nuevas granjas, es por esto que hacemos todo lo posible por brindarte los mejores servicios.";
    this.subtitle = "Tus Granjas";
    this.name = "Nombre";
    this.state = "Estado";
    this.quantyusers = "Cantidad de usuarios con acceso";
    this.add = "Agregar";
    this.edit = "Editar";
    this.save = "Guardar";
    this.start = "Comienza a agregar tu primera granja dando al boton de agregar ubicado en la parte inferior";
    this.isEditable = false;
  }

  ngOnInit(): void {
    this.init();
  }

  init() {
    this.farms = [];
    this.farmsO = [];
    this.farmsO = this.userService.getFarms();
    if (this.farmsO != undefined) {
      this.farmsO.forEach(element => this.farms.push(new Farm(element.id, element.name)));
    }
  }

  async setEditable(editable: boolean) {
    this.isEditable = editable;
    if (!editable) {
      let selectedFarms: Object[] = [];
      for (let i = 0; i < this.farmsO.length; i++) {
        if (this.farms[i].name != this.farmsO[i].name) {
          selectedFarms.push({ id: this.farms[i].id, name: this.farms[i].name });
        }
      }
      selectedFarms.forEach(element => {
        this.userService.putFarm(element).subscribe(
          async res => {
            if (res) {
              await this.userService.updateFarms();
              await Swal.fire({
                icon: 'success',
                text: `Granja(s) Actualizada(s) exitosamente`,
                showConfirmButton: false,
                timer: 1500
              });
              this.init();
            }else{
              Swal.fire({
                icon: 'error',
                text: 'Ha ocurrido un error',
                showConfirmButton: false,
                timer: 1500
              });
            }
          }
        );
      });
    }
  }

  async addFarm() {
    const { value: nameFarm } = await Swal.fire({
      title: 'Ingresa el nombre de tu granja',
      input: 'text',
      inputLabel: 'Digita el nombre de tu nueva granja',
      showCancelButton: true,
    });
    if (nameFarm) {
      this.userService.addNewFarm(nameFarm).subscribe(
        async res => {
          if (res) {
            await this.userService.updateFarms();
            await Swal.fire({
              icon: 'success',
              text: `Granja: ${nameFarm} creada exitosamente`,
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
        }
      );
    } else {
      await Swal.fire({
        icon: 'error',
        text: 'El campo no puede estar vacio',
        showConfirmButton: false,
        timer: 1500
      });
    }
  }

  predeleteFarm(id) {
    this.preDeletedFarm = id;
  }

  deleteFarm() {
    this.userService.removeFarm(this.preDeletedFarm).subscribe(
      async res => {
        if (res) {
          await this.userService.updateFarms();
          await Swal.fire({
            icon: 'success',
            text: `Granja eliminada exitosamente`,
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
      }
    );
    this.isEditable = false;
    this.init();
  }
}
