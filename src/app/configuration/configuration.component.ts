import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { UserServiceService } from '../services/user-service.service';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent {
  
  protected infoUser:object[];
  protected isEdit:boolean;

  constructor(private userService:UserServiceService) {
    this.infoUser = [];
    this.updateInfo();
  }

  updateInfo() {
    this.infoUser = this.userService.getInfoUser();
  }
  
  edit(){
    this.isEdit = !this.isEdit;
    if (!this.isEdit) {
      this.userService.updateInfoUser(this.infoUser[0]['names'], this.infoUser[0]['lastnames'], this.infoUser[0]['phone']).subscribe(
        res =>{
          if (res) {
            Swal.fire({
              icon: 'success',
              text: 'Usuario creado exitosamente',
            });
          }
        }
      );
    }
  }
}
