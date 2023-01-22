import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.css']
})
export class AboutusComponent implements OnInit {

  protected sections;

  constructor() {
    this.sections = [
      {
        title:"Misión",
        description:"La mision de SIGEAVI es ayudar a nuestros granjeros a tener un mayor control en sus producciones avicolas, ayudarles a maximizar sus operaciones con la supervision y control de las labores que se ejercen dentro del sector y sugerirles los mejores caminos para llevar su negocio al exito",
      },
      {
        title:"Visión",
        description:"La visión de SIGEAVI es lograr cubrir un alcance nacional, en donde podamos ayudar a gestionar los procesos de nuestros granjeros en Colombia y lograr una mayor productividad frente al mercado actual",
      },
      {
        title:"Objetivo Principal",
        description:"El objetivo principal de nuestro software es atender las más altas demandas en cuanto a la gestión de la industria agricola, mejorando las operaciones técnicas que requieren las granjas en la actualidad",
      }
    ];
  }

  ngOnInit(): void {
  }

}
