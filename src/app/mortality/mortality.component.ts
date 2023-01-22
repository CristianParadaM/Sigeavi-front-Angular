import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Lot } from '../lot.model';
import { UserServiceService } from '../services/user-service.service';

@Component({
  selector: 'app-mortality',
  templateUrl: './mortality.component.html',
  styleUrls: ['./mortality.component.css']
})
export class MortalityComponent implements OnInit {

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

  protected lotsOriginal:Lot[];
  protected lots:Lot[];
  protected history: object[];
  protected selectedLot;
  protected selectedLots:number[];
  protected lastDates:string[];
  protected isRegistred;

  constructor(private userService: UserServiceService) {
    this.subtitle = "Registro de mortalidad de las aves";
    this.lot = "Lote";
    this.registerMortality = "Registro de Mortalidad";
    this.searchLot = "Buscar Lote";
    this.date = "Fecha: ";
    let date = new Date(Date.now());
    this.dateValue = date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear();
    this.kills = "Muertes";
    this.killsNumber = 0;
    this.registerStatusTrue = "Mortalidad ya registrada";
    this.registerStatus = "Mortalidad aún no registrada";
    this.save = "Guardar";
    this.footer = "SIGEAVI te recomienda llevar a diario un control de mortalidad de aves en los lotes para tener un mayor control sobre la cantidad de aves en los galpones.";  
    this.selectedLot = 0;
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
    this.select(this.selectedLot, 0);
  }

  formatDate(date){
    let split = date.split('-');
    return split[2]+'/'+split[1]+'/'+split[0];
  }

  filter(pattern:string){
    this.lots = [];
    this.lotsOriginal.forEach(element => {
      if (element.lot.includes(pattern)) {
        this.lots.push(element);
      }
    });
  }

  select(id:number, i:number){
    for (let i = 0; i < this.selectedLots.length; i++) {
      this.selectedLots[i] = -1;
    }
    this.selectedLot = id;
    this.selectedLots[i] = 1;
    this.updateInfo();
  }

  saveChanges(){
    this.userService.updateMortality(this.selectedLot, this.killsNumber).subscribe({
      next: () => {
        Swal.fire({icon: 'success', text: 'Mortalidad Registrada', showConfirmButton: false, timer: 1500});
        this.updateInfo();
      }
    });
  }

  private updateInfo() {
    this.userService.getMortalityWater(this.selectedLot).subscribe(
      (res) => {
        this.history = [];
        for (let i = 0; i < res['length']; i++) {
          if(res[i]['numberOfDeaths'] != 0 && res[i]['numberOfDeaths'] != null){
            this.history.push({
              date:(res[i]['date'].split('T')[0]),
              dies:res[i]['numberOfDeaths'],
              lot:"L-"+res[i]['lotNumber'],
            });
          }
        }
        if (this.history.length > 0) {
          let datenow = new Date(Date.now());
          this.isRegistred = this.history[this.history.length-1]['date'] == datenow.toLocaleDateString('en-CA');
          if (this.isRegistred) {
            this.killsNumber = this.history[this.history.length-1]['dies'];
            if (this.killsNumber == 0 || this.killsNumber == null) {
              this.killsNumber = 0;
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
