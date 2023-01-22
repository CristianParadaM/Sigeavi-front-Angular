import { Component, NgModule } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { single } from 'rxjs';
import Swal from 'sweetalert2';
import { UserServiceService } from '../services/user-service.service';

@Component({
  selector: 'app-foodreport',
  templateUrl: './foodreport.component.html',
  styleUrls: ['./foodreport.component.css']
})
export class FoodreportComponent {

  protected isVisible;
  protected formDates;
  protected aux:number[];
  protected infoGraph: object[];
  protected infoLotTotal: object[];
  protected pieChart: object[];
  protected view = [300,300];
  protected colorScheme = {
    domain: ['#F2A918', '#FC8700', '#E65300', '#FC3D0D', 'F2140C']
  };

  constructor(private userService: UserServiceService, private formBuilder: FormBuilder) {
    this.isVisible = false;
    this.formDates = this.formBuilder.group({
      initialDate: ['', [
        Validators.required
      ]],
      finalDate: ['', [
        Validators.required,
      ]]
    });
  }

  chargeInfo(initialDate, finalDate) {
    this.infoLotTotal = [];
    this.pieChart = [];
    this.aux = [Math.random()];
    this.userService.getTotalFoodLots(initialDate, finalDate).subscribe(
      (res: Array<Object>) =>{
        console.log(res)
        for (let i = 0; i < res.length; i++) {
          this.infoLotTotal.push({
            id:res[i]['id_lot'],
            average:res[i]['promedio'],
            total:res[i]['total_consumido']
          });
          this.pieChart.push({
            name: "L-"+res[i]['lotNumber'] +" / G-"+ res[i]['shedNumber'],
            value: res[i]['total_consumido']
          });
        }
      }
    )
    let lotsinReq: number[] = [];
    this.infoGraph = [];
    this.userService.getFoodReport(initialDate, finalDate).subscribe(
      (res: Array<Object>) => {
        for (let i = 0; i < res.length; i++) {
          if (lotsinReq.indexOf(res[i]['id_lot']) == -1) {
            this.infoGraph.push({
              id:res[i]['id_lot'],
              view: this.view,
              scheme: this.colorScheme,
              results: [{ name: new Date(res[i]['foodDate'].split('T')[0]).toLocaleDateString('en-AU'), value: res[i]['alimento_consumido'] }],
              gradient: false,
              xAxis: true,
              yAxis: true,
              legend:false,
              showXAxisLabel:true,
              showYAxisLabel:true,
              xAxisLabel:"Fechas de Consumo para: L-"+res[i]['lotNumber']+" / G-"+res[i]['shedNumber'],
              yAxisLabel:"Consumo Total (gr)",
            });
          }else{
            this.addResult(res[i]);
          }
          lotsinReq.push(res[i]['id_lot']);
        }
        this.isVisible = true;
      }
    );
  }
  
  addResult(res: Object) {
    for (let i = 0; i < this.infoGraph.length; i++) {
        if(this.infoGraph[i]['id'] == res['id_lot']){
          this.infoGraph[i]['results'].push({name: new Date(res['foodDate'].split('T')[0]).toLocaleDateString('en-AU'), value: res['alimento_consumido']});
        }
    }
  }

  getTotalConsum(id:number):string{
    for (let i = 0; i < this.infoLotTotal.length; i++) {
      if (this.infoLotTotal[i]['id'] == id) {
        return this.infoLotTotal[i]['total'];
      }
    }
    return null;
  }

  getAverageBird(id:number):string{
    for (let i = 0; i < this.infoLotTotal.length; i++) {
      if (this.infoLotTotal[i]['id'] == id) {
        return this.infoLotTotal[i]['average'];
      }
    }
    return null;
  }

  verifyDates(){
    if (this.formDates.value.initialDate < this.formDates.value.finalDate) {
      this.chargeInfo(this.formDates.value.initialDate, this.formDates.value.finalDate);
    }else{
      Swal.fire({
        icon: 'error',
        text: 'La fecha inicial debe ser antes que la fecha final',
        timer:2500,
        showConfirmButton: false
      });
    }
  }

}
