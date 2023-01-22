import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Lot } from '../lot.model';
import { UserServiceService } from '../services/user-service.service';

@Component({
  selector: 'app-vacunation',
  templateUrl: './vacunation.component.html',
  styleUrls: ['./vacunation.component.css']
})
export class VacunationComponent implements OnInit {

  protected subtitle;
  protected lot; 
  protected vacunations;
  protected subtitle2;
  protected pharagraph1;
  protected pharagraph2;
  protected pharagraph3;
  protected pharagraph4;
  protected placeholdersearch;
  protected illness;
  protected dateRecomended;
  protected aplication;
  protected observations;
  protected editText;
  protected appliedVaccines;

  protected lotsOriginal:Lot[];
  protected lots:Lot[];
  protected vaccinesOriginal:object[];
  protected vaccines:object[];
  protected selectedLot;
  protected selected;
  protected selectedLots:number[];
  protected lastDates:string[];
  protected isEdit;

  constructor(private userService:UserServiceService) {
    this.subtitle = "Plan recomendado de vacunación";
    this.lot = "Lote";
    this.vacunations = "Cronograma de Vacunas";
    this.subtitle2 = "¿Qué te recomienda SIGEAVI?";
    this.pharagraph1 = "Te recomendamos que estes pendiente de las fechas sugeridas para realizar las vacunaciones de tu lote.";
    this.pharagraph2 = "Recuerda que SIGEAVI te recomienda aplicar ciertas vacunas para evitar ciertas enfermedades, pero esta en ti decidir que marca de vacuna aplicar.";
    this.pharagraph3 = "En el apartado de observaciones puedes especificar estos detalles adicionales.";
    this.pharagraph4 = "En la sección vacunas aplicadas podrás llevar un historial de las vacunas que ya aplicaste.";
    this.placeholdersearch = "Buscar Lote";
    this.illness = "Enfermedad";
    this.dateRecomended = "Fechas recomendadas";
    this.aplication = "Aplicación";
    this.observations = "Observaciones";
    this.editText = "Editar";
    this.appliedVaccines = "Vacunas aplicadas";
    this.selectedLot = 0;
    this.selected = 0;
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
    this.userService.getVaccinesHistory(this.selectedLot).subscribe(
      (res) => {
        this.vaccines = [];
        this.vaccinesOriginal = [];
        for (let i = 0; i < res['length']; i++) {
            let initialdate = new Date((res[i]['initialDate'].split('T')[0])).toLocaleDateString('en-AU');
            let finallDate = new Date((res[i]['finalDate'].split('T')[0])).toLocaleDateString('en-AU')
            this.vaccines.push({
              id: res[i]['id'],
              date: initialdate+ ' - '+finallDate,
              illness:res[i]['illness'],
              aplication:res[i]['application_method'],
              observations:res[i]['observations']==null?'':res[i]['observations']
            });
            this.vaccinesOriginal.push({
              id: res[i]['id'],
              date: initialdate+ ' - '+finallDate,
              illness:res[i]['illness'],
              aplication:res[i]['application_method'],
              observations:res[i]['observations']==null?'':res[i]['observations']
            });
        }
      }
    );
  }

  edit(){
    this.isEdit = !this.isEdit;
    if (!this.isEdit) {
      let vaccinesChanged: object[] = []; 
      for (let i = 0; i < this.vaccinesOriginal.length; i++) {
          if (this.vaccinesOriginal[i]['observations'] != this.vaccines[i]['observations']) {
            vaccinesChanged.push({id:this.vaccines[i]['id'], observations:this.vaccines[i]['observations']});
          }
      }

      vaccinesChanged.forEach(element => {
          this.userService.putVaccinesObservations(element).subscribe(
            async res =>{
              if (res) {
                this.updateInfo();
                await Swal.fire({
                  icon: 'success',
                  text: `Guardado exitosamente`,
                  showConfirmButton: false,
                  timer: 1500
                });
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
      this.isEdit = false;
    }
  }

}
