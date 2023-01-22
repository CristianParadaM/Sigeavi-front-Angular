import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../services/user-service.service';

@Component({
  selector: 'app-spacemagnament',
  templateUrl: './spacemagnament.component.html',
  styleUrls: ['./spacemagnament.component.css']
})
export class SpacemagnamentComponent implements OnInit {

  protected subtitle: string;
  protected chickenSpace: string;
  protected spaceChickens: string;
  protected quantyRecomended: string;
  protected spaceRecomended: string;
  protected footer: string;
  protected quanty: number;
  protected space: number;
  protected value1:number = 10;
  protected value2 = 1;
  protected coordy:number[];
  protected coordx:number[];
  private aux:number;

  constructor() {
    this.subtitle = "Simulador de gestión de Espacio en los galpones";
    this.chickenSpace = "Gallinas recomendadas por espacio";
    this.spaceChickens = "Espacio recomendado según cantidad de gallinas";
    this.quantyRecomended = "Cantidad máxima recomendada de gallinas: ";
    this.spaceRecomended = "Cantidad mínima recomendada de espacio: ";
    this.footer = "La finalidad de está función es determinar la cantidad de aves recomendada que se puede tener en un espacio determinado y también el espacio necesario según la cantidad de gallinas, para que estas tengan una buena calidad de vida";
    this.quanty = 100;
    this.space = 200
  }

  ngOnInit(): void {
    this.init();
  }

  init(){
    let auxy = 1;
    this.coordy = [];
    this.coordx = [];
    this.aux = 10;
    for (let i = 0; i < this.value2 && i < 126; i++) {
      this.coordy.push(Math.random()*10 + auxy);
      this.coordx.push(this.aux);
      this.aux+=40;
      if (this.coordx.length % 18 == 0) {
        auxy += 40;
        this.aux = 10;
      }
    }
  }

  updateValue(x: number){
    this.value2 = x;
    this.init();
  }

  calculateMetters(n1:number, n2:number){
    this.value1 = n1 * n2
  }

  calculateQuanty(meters: number){
    this.quanty = meters*10;
  }

  calculateMeters(quanty: number){
    this.space = quanty / 10;
  }
}
