import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Lot } from '../lot.model';
import { UserServiceService } from '../services/user-service.service';

@Component({
  selector: 'app-weight',
  templateUrl: './weight.component.html',
  styleUrls: ['./weight.component.css']
})
export class WeightComponent implements OnInit {

  protected subtitle;
  protected lot;
  protected registerWeight;
  protected searchLot;
  protected quantyBirdsNumber;

  protected quantyBirds;
  protected recorder;
  protected quantyBirdsRecomended;
  protected registerStatus;
  protected save;
  protected footer;

  protected lotsOriginal:Lot[];
  protected lots:Lot[];
  protected history:object[]
  protected quantyBirdsLotRecomended;
  protected quantyBirdsLot;
  protected selectedLot;
  protected selectedLots:number[];
  protected lastDates:string[];
  protected isRegistred;

  constructor(private userService: UserServiceService) {
    this.subtitle = "Registro de peso de las aves";
    this.lot = "Lote";
    this.registerWeight = "Registro de Peso";
    this.searchLot = "Buscar Lote";
    this.quantyBirdsNumber = 2.2;
    this.quantyBirds = "Cantidad de Aves en el Lote: ";
    this.recorder  = "Recuerda registrar un promedio del peso de las aves";
    this.quantyBirdsRecomended = "Cantidad de Aves recomendadas a pesar: ";
    this.registerStatus = "Peso aún no registrado";
    this.save = "Guardar";
    this.footer = "SIGEAVI te recomienda llevar semanalmente un control del peso de las aves en los lotes para poder sugerir una dieta de alimentación balanceada para cubrir los defectos en el peso durante la semana";  
    this.quantyBirdsLotRecomended = 110;
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

  updateInfo() {
    this.userService.getWeightHistory(this.selectedLot).subscribe(
      (res) => {
        this.history = [];
        for (let i = 0; i < res['length']; i++) {
          if(res[i]['weight']!=null && res[i]['weight']!=0){
            this.history.push({
              id: res[i]['id'],
              date:(res[i]['date'].split('T')[0]),
              weight:res[i]['weight'],
              lot:"L-"+res[i]['lotNumber'],
            });
          }
        }
        if (this.history.length > 0) {
          let datenow = new Date(Date.now());
          this.isRegistred = this.history[this.history.length-1]['date'] == datenow.toLocaleDateString('en-CA');
          if (this.isRegistred) {
            this.quantyBirdsNumber = this.history[this.history.length-1]['weight'];
            if (this.quantyBirdsNumber == 0 || this.quantyBirdsNumber == null) {
              this.quantyBirdsNumber = 1;
              this.isRegistred = false;
            }
          }
        }else{
          this.isRegistred = false;
        }
      }
    );
  }

  saveChanges(){
    if (this.isRegistred) {
      this.userService.updateWeight(this.selectedLot, this.quantyBirdsNumber).subscribe(
        (x) => {
          if(x){
            Swal.fire({
              icon: 'success',
              text: 'Peso actualizado exitosamente',
              showConfirmButton: false,
              timer:1500
            });
            this.updateInfo();
          }else{
            Swal.fire({
              icon: 'error',
              text: 'Ha ocurrido un error',
              showConfirmButton: false,
              timer:1500
            });
          }
        },err=> console.log(err)
      );
    }else{
      this.userService.addWeightHistory(this.selectedLot, this.quantyBirdsNumber).subscribe(
        (x) => {
          Swal.fire({
            icon: 'success',
            text: 'Peso registrado exitosamente',
            showConfirmButton: false,
            timer:1500
          });
          this.updateInfo();
        },err=> console.log(err)
      );
    }
  }
}
