import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {

  protected emailSupport:string;
  protected phoneNumber1:string;
  protected phoneNumber2:string;
  protected copyRightText:string;
  @Input() isMenu: boolean;

  constructor() { 
    this.emailSupport = "avicolaSoftware@support.co";
    this.phoneNumber1 = "314-282-7550";
    this.phoneNumber2 = "310-257-4918";
    this.copyRightText = "©CopyRight 2022. Todos los derechos reservados";
  }

}
