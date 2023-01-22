import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UserServiceService } from '../services/user-service.service';
import { Sheed } from '../sheed.model';

interface ISelected {
  index: number;
  value: boolean;
}

@Component({
  selector: 'app-sheed',
  templateUrl: './sheed.component.html',
  styleUrls: ['./sheed.component.css']
})

export class SheedComponent implements OnInit {

  protected placeholderSearch;
  protected sheedsOriginal: Sheed[];
  protected sheeds: Sheed[];
  protected selection: ISelected[];
  protected nSheed;
  protected quanty;
  protected width;
  protected height;
  protected deleteSheedSelected: number;
  protected inputQuanty = 0;
  protected formAddSheed;

  constructor(private userService: UserServiceService, private formBuilder: FormBuilder) {
    this.placeholderSearch = "Buscar por numero / dimensiones";
    this.nSheed = "Número de Galpón";
    this.quanty = "Número de Aves";
    this.width = "Ancho Galpón";
    this.height = "Alto Galpón";
  }

  ngOnInit(): void {
    this.init();
    this.formAddSheed = this.formBuilder.group({
      sheed: ['', [
        Validators.required
      ]],
      width: ['', [
        Validators.required
      ]],
      height: ['', [
        Validators.required
      ]]
    })
  }

  init() {
    this.sheedsOriginal = this.userService.getSheeds();
    this.sheeds = this.sheedsOriginal;
    this.selection = [];
    for (let i = 0; i < this.sheedsOriginal.length; i++) {
      this.selection.push({ index: i, value: false });
    }
  }

  filtre(pattern: string) {
    this.sheeds = [];
    this.sheedsOriginal.forEach(element => {
      if (element.sheed.includes(pattern)) {
        this.sheeds.push(element);
      } else if (element.quanty.toString().includes(pattern)) {
        this.sheeds.push(element);
      } else if (element.width.toString().includes(pattern)) {
        this.sheeds.push(element);
      } else if (element.height.toString().includes(pattern)) {
        this.sheeds.push(element);
      }
    });
  }

  order(orderBy) {
    switch (orderBy) {
      case 0:
        this.sheeds = this.sheeds.sort((a: Sheed, b: Sheed) => {
          return parseInt(a.sheed.substring(2, a.sheed.length)) >= parseInt(b.sheed.substring(2, b.sheed.length)) ? 1 : -1;
        });
        break;
      case 1:
        this.sheeds = this.sheeds.sort((a: Sheed, b: Sheed) => {
          return a.quanty > b.quanty ? 1 : -1;
        });
        break;
      case 2:
        this.sheeds = this.sheeds.sort((a: Sheed, b: Sheed) => {
          return a.width > b.width ? 1 : -1;
        });
        break;
      case 3:
        this.sheeds = this.sheeds.sort((a: Sheed, b: Sheed) => {
          return a.height > b.height ? 1 : -1;
        });
        break;
    }
  }

  isSelected(index) {
    return this.selection[index].value;
  }

  selectOption(index) {
    this.selection.forEach(element => {
      if (element.index == index) {
        element.value = !element.value;
      } else {
        element.value = false;
      }
    });
  }

  predelete(i) {
    this.deleteSheedSelected = i;
  }

  delete() {
    this.userService.removeShed(this.deleteSheedSelected).subscribe(
      res=>{
        Swal.fire({
          icon: 'success',
          text: 'Removido exitosamente',
          showConfirmButton: false,
          timer: 1500
        });
        this.updateViewsheds();
      }
    );
  }

  addSheed() {
    this.userService.addShed(this.formAddSheed.value.sheed.split('-')[1], this.formAddSheed.value.width, this.formAddSheed.value.height).subscribe(
      async res =>{
        if (res) {
          Swal.fire({
            icon: 'success',
            text: 'Agregado exitosamente',
            showConfirmButton: false,
            timer: 1500
          });
          this.updateViewsheds();
        }else{
          Swal.fire({
            icon: 'question',
            text: 'Ya hay un galpon con ese numero de identificación',
          });
        }
      }
    );
  }

  private updateViewsheds() {
    this.userService.updateSheds().subscribe(
      res => {
        let sheds = [];
        for (let i = 0; i < res['length']; i++) {
          sheds.push(new Sheed(res[i].id, 'G-'+res[i].shedNumber, res[i].amount_hens, res[i].width, res[i].length));
        }
        this.userService.setSheds(sheds);
        this.init();
        this.formAddSheed.reset();
      }
    );
  }

  update(id, shedNumber, width, length){
    this.userService.putSheds(id, shedNumber.split('-')[1], width, length).subscribe(
      res =>{
        Swal.fire({
          icon: 'success',
          text: 'Actualizado exitosamente',
          showConfirmButton: false,
          timer: 1500
        });
        this.updateViewsheds();
      }
    );
  }

  isQuantyMax(width:number, height:number, quanty:number): number{
    let quantyMax = (width * height) * 10;
    if (quantyMax < quanty ) {
      return 3;
    }else{
      let dif = quantyMax - quanty;
      return  dif < 50? 2: dif < 10? 1: 0;
    }
  }
}
