import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Lot } from '../lot.model';
import { UserServiceService } from '../services/user-service.service';

@Component({
  selector: 'app-water',
  templateUrl: './water.component.html',
  styleUrls: ['./water.component.css']
})
export class WaterComponent implements OnInit {

  protected subtitle;
  protected lot;
  protected registerWater;
  protected searchLot;
  protected date;
  protected dateValue;
  protected liters;
  protected litersNumber;
  protected registerStatus;
  protected registerStatusTrue;
  protected save;
  protected footer;

  protected lotsOriginal: Lot[];
  protected lots: Lot[];
  protected history: object[];
  protected selectedLot;
  protected selectedLots: number[];
  protected isRegistred;

  constructor(private userService: UserServiceService) {
    this.subtitle = "Registro del consumo de Agua por lotes";
    this.lot = "Lote";
    this.registerWater = "Registro de agua consumida";
    this.searchLot = "Buscar Lote";
    this.date = "Fecha: ";
    let date = new Date(Date.now());
    this.dateValue = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    this.liters = "Litros";
    this.litersNumber = 50;
    this.registerStatusTrue = "Consumo ya registrado";
    this.registerStatus = "Consumo aún no registrado";
    this.save = "Guardar";
    this.footer = "SIGEAVI te recomienda llevar a diario un control del agua consumida por las aves para tener un mayor control frente a la trazabilidad de la vida de las gallinas";
  }

  ngOnInit(): void {
    this.lotsOriginal = this.userService.getLots();
    this.lots = this.lotsOriginal;
    if (this.lots.length > 0) {
      this.selectedLot = this.lots[0].id;
    }
    this.selectedLots = [1];
    for (let i = 1; i < this.lots.length; i++) {
      this.selectedLots.push(-1);
    }
    this.select(this.selectedLot, 0)  
  }

  filter(pattern: string) {
    this.lots = [];
    this.lotsOriginal.forEach(element => {
      if (element.lot.includes(pattern)) {
        this.lots.push(element);
      }
    });
  }

  select(id: number, i:number) {
    for (let i = 0; i < this.selectedLots.length; i++) {
      this.selectedLots[i] = -1;
    }
    this.selectedLot = id;
    this.selectedLots[i] = 1;
    this.updateInfo();
  }

  saveChanges() {
    this.userService.updateWater(this.selectedLot, this.litersNumber).subscribe(
      (x) => {
        Swal.fire({
          icon: 'success',
          text: 'Consumo registrado exitosamente',
          showConfirmButton: false,
          timer:1500
        });
        this.updateInfo();
      },err=> console.log(err)
    );
  }

  private updateInfo() {
    this.userService.getMortalityWater(this.selectedLot).subscribe(
      (res) => {
        this.history = [];
        for (let i = 0; i < res['length']; i++) {
          if(res[i]['waterConsumption']!=null && res[i]['waterConsumption']!=0){
            this.history.push({
              date:(res[i]['date'].split('T')[0]),
              liters:res[i]['waterConsumption'],
              lot:"L-"+res[i]['lotNumber'],
            });
          }
        }
        if (this.history.length > 0) {
          let datenow = new Date(Date.now());
          this.isRegistred = this.history[this.history.length-1]['date'] == datenow.toLocaleDateString('en-CA');
          if (this.isRegistred) {
            this.litersNumber = this.history[this.history.length-1]['liters'];
            if (this.litersNumber == 0 || this.litersNumber == null) {
              this.litersNumber = 1;
              this.isRegistred = false;
            }
          }
        }else{
          this.isRegistred = false;
        }
      }
    );
  }
}
