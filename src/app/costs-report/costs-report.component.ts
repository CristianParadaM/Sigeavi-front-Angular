import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UserServiceService } from '../services/user-service.service';

@Component({
  selector: 'app-costs-report',
  templateUrl: './costs-report.component.html',
  styleUrls: ['./costs-report.component.css']
})
export class CostsReportComponent {
  protected isVisible;
  protected formDates;
  protected aux:number[];
  protected infoGraph: object[];
  protected infoLotTotal: object[];
  protected pieChart: object[];
  protected view = [400,400];
  protected colorScheme = {
    domain: ['#0DFDBD', '#0BE36C', '#00FA2A', '#2AE30B', '#83FD0D']
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
    this.userService.getTotalCostsLots(initialDate, finalDate).subscribe(
      (res: Array<Object>) =>{
        console.log('total')
        console.log(res)
        for (let i = 0; i < res.length; i++) {
          this.infoLotTotal.push({
            id:res[i]['id'],
            total:res[i]['Costo_total']
          });
          this.pieChart.push({
            name: "L-"+res[i]['lotNumber'] +" / G-"+ res[i]['shedNumber'],
            value: res[i]['Costo_total']
          });
        }
      }
    )
    let lotsinReq: number[] = [];
    this.infoGraph = [];
    this.userService.getCostsReport(initialDate, finalDate).subscribe(
      (res: Array<Object>) => {
        console.log('report')
        console.log(res)
        for (let i = 0; i < res.length; i++) {
          if (lotsinReq.indexOf(res[i]['id']) == -1) {
            this.infoGraph.push({
              id:res[i]['id'],
              view: this.view,
              scheme: this.colorScheme,
              results: [{ name: new Date(res[i]['date'].split('T')[0]).toLocaleDateString('en-AU')+'\n '+res[i]['description'], value: res[i]['price'] }],
              gradient: false,
              xAxis: true,
              yAxis: true,
              legend:false,
              showXAxisLabel:true,
              showYAxisLabel:true,
              xAxisLabel:"Costos por Lote: L-"+res[i]['lotNumber']+" / Galpón: G-"+res[i]['shedNumber'],
              yAxisLabel:"Costos totales",
            });
          }else{
            this.addResult(res[i]);
          }
          lotsinReq.push(res[i]['id']);
        }
        this.isVisible = true;
      }
    );
  }
  
  addResult(res: Object) {
    for (let i = 0; i < this.infoGraph.length; i++) {
        if(this.infoGraph[i]['id'] == res['id']){
          this.infoGraph[i]['results'].push({name: new Date(res['date'].split('T')[0]).toLocaleDateString('en-AU')+"\n "+res['description'], value: res['price']});
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
