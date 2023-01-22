import { Component, OnInit } from '@angular/core';
import { initializeApp } from '@angular/fire/app';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Lot } from '../lot.model';
import { UserServiceService } from '../services/user-service.service';
import { Sheed } from '../sheed.model';

interface ISelected {
  index: number;
  value: boolean;
}

@Component({
  selector: 'app-chickens',
  templateUrl: './chickens.component.html',
  styleUrls: ['./chickens.component.css']
})

export class ChickensComponent implements OnInit {

  protected placeholderSearch;
  protected nLote;
  protected birthdate;
  protected sheep;
  protected quanty;
  protected raceChickens;
  protected lots: Lot[];
  protected lotsOriginal: Lot[];
  protected sheeds: Sheed[];
  protected selection: ISelected[];
  protected deleteLotSelected: Lot;
  protected inputQuanty = 0;
  protected formAddLot;

  constructor(private userService: UserServiceService, private formBuilder: FormBuilder) {
    this.placeholderSearch = "Buscar por fecha / Número de lote / Galpón asignado / raza";
    this.nLote = "Numero de Lote";
    this.birthdate = "Fecha de Nacimiento de las Aves";
    this.sheep = "Galpón Asignado";
    this.quanty = "Cantidad de Aves";
    this.raceChickens = "Raza de las Aves";
  }

  ngOnInit(): void {
    this.init();
    this.formAddLot = this.formBuilder.group({
      lot: ['', [
        Validators.required
      ]],
      date: ['', [
        Validators.required
      ]],
      sheed: ['', [
        Validators.required
      ]],
      quanty: ['', [
        Validators.required
      ]],
      race: ['', [
        Validators.required
      ]]
    })
  }

  init() {
    this.lotsOriginal = [];
    this.lots = [];
    this.lotsOriginal = this.userService.getLots();
    this.sheeds = this.userService.getSheeds();
    this.lots = this.lotsOriginal;
    this.selection = [];
    for (let i = 0; i < this.lotsOriginal.length; i++) {
      this.selection.push({ index: i, value: false });
    }
  }

  filtre(pattern: string) {
    this.lots = [];
    this.lotsOriginal.forEach(element => {
      if (element.date.includes(pattern)) {
        this.lots.push(element);
      } else if (element.lot.includes(pattern)) {
        this.lots.push(element);
      } else if (element.sheed.includes(pattern)) {
        this.lots.push(element);
      } else if (element.race.includes(pattern)) {
        this.lots.push(element);
      }
    });
  }
  getParseDate(date: string, pattern): string {
    let dateParse: string;
    let dateSplit = date.split('/');
    if (pattern != undefined) {
      if (parseInt(dateSplit[1]) < 10) {
        if (parseInt(dateSplit[0]) < 10) {
          dateParse = dateSplit[2] + '-' + dateSplit[1] + '-' + dateSplit[0];
        } else {
          dateParse = dateSplit[2] + '-' + dateSplit[1] + '-' + dateSplit[0];
        }
      } else {
        if (parseInt(dateSplit[0]) < 10) {
          dateParse = dateSplit[2] + '-' + dateSplit[1]+ '-' + dateSplit[0];
        } else {
          dateParse = dateSplit[2] + '-' +  dateSplit[1]+ '-' + dateSplit[0];
        }
      }
    } else {
      if (parseInt(dateSplit[1]) < 10) {
        if (parseInt(dateSplit[0]) < 10) {
          dateParse = '0' + parseInt(dateSplit[0]) + '/0' + parseInt(dateSplit[1]) + '/' + parseInt(dateSplit[2]);
        } else {
          dateParse = parseInt(dateSplit[0]) + '/0' + parseInt(dateSplit[1]) + '/' + parseInt(dateSplit[2]);
        }
      } else {
        if (parseInt(dateSplit[0]) < 10) {
          dateParse = '0' + parseInt(dateSplit[0]) + '/' + parseInt(dateSplit[1]) + '/' + parseInt(dateSplit[2]);
        } else {
          dateParse = parseInt(dateSplit[0]) + '/' + parseInt(dateSplit[1]) + '/' +parseInt(dateSplit[2]);
        }
      }
    }
    return dateParse;
  }

  predelete(i) {
    this.deleteLotSelected = i;
  }

  delete() {
    this.userService.removeLot(this.deleteLotSelected.id).subscribe(
      res=>{
        Swal.fire({
          icon: 'success',
          text: 'Removido exitosamente',
          showConfirmButton: false,
          timer: 1500
        });
        this.updateViewLots();
      }
    );
  }

  updateViewLots(){
    this.userService.updateLots().subscribe(
      res => {
        let lots = [];
        for (let i = 0; i < res['length']; i++) {
          let date = res[i].dateOfBirth.split('T')[0].split('-');
          lots.push(new Lot(res[i].id, 'L-'+res[i].lotNumber, date[2]+'/'+date[1]+'/'+date[0], 'G-'+res[i].shedNumber,res[i].amount_hens, res[i].race));
        }
        this.userService.setLots(lots);
        this.init();
        this.formAddLot.reset();
      }
    );
    this.userService.updateSheds().subscribe(
      res => {
        let sheds = [];
        for (let i = 0; i < res['length']; i++) {
          sheds.push(new Sheed(res[i].id, 'G-'+res[i].shedNumber, res[i].amount_hens, res[i].width, res[i].length));
        }
        this.userService.setSheds(sheds);
      }
    );
  }

  order(orderBy) {
    switch (orderBy) {
      case 0:
        this.lots = this.lots.sort((a: Lot, b: Lot) => {
          return parseInt(a.lot.substring(2, a.lot.length)) >= parseInt(b.lot.substring(2, b.lot.length)) ? 1 : -1;
        });
        break;
      case 1:
        this.lots = this.lots.sort((a: Lot, b: Lot) => {
          return a.date > b.date ? 1 : -1;
        });
        break;
      case 2:
        this.lots = this.lots.sort((a: Lot, b: Lot) => {
          return parseInt(a.sheed.substring(2, a.sheed.length)) >= parseInt(b.sheed.substring(2, b.sheed.length)) ? 1 : -1;
        });
        break;
      case 3:
        this.lots = this.lots.sort((a: Lot, b: Lot) => {
          return a.quanty > b.quanty ? 1 : -1;
        });
        break;
      case 4:
        this.lots = this.lots.sort((a: Lot, b: Lot) => {
          return a.race >= b.race ? 1 : -1;
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

  update(id, lot, date, sheed ,quanty, race) {
    this.userService.putLots(id, lot.split('-')[1], date, sheed, quanty, race).subscribe(
      res =>{
        Swal.fire({
          icon: 'success',
          text: 'Actualizado exitosamente',
          showConfirmButton: false,
          timer:1500
        });
        this.updateViewLots();
      }
    );
  }

  getNumber(number: string): number {
    return parseInt(number)
  }

  updateQuanty(n) {
    this.inputQuanty = parseInt(n);
  }

  async addLot() {
    this.userService.addLot(this.formAddLot.value.date, this.formAddLot.value.lot.split('-')[1], this.formAddLot.value.sheed, this.formAddLot.value.quanty, this.formAddLot.value.race).subscribe(
      async res =>{
        if (res) {
          Swal.fire({
            icon: 'success',
            text: 'Agregado exitosamente',
            showConfirmButton: false,
            timer:1500
          });
          this.updateViewLots();
        }else{
          Swal.fire({
            icon: 'question',
            text: 'Ya hay un lote con ese numero de identificación en este galpon',
          });
        }
      }
    );
  }
}
