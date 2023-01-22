import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { equalsValidation } from '../app.customvalidator';
import { UserServiceService } from '../services/user-service.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {

  protected viewRegister: number;
  protected title: string;
  protected titlePersonalData: string;
  protected placeholderNames: string;
  protected placeholderLastNames: string;
  protected placeholderEmail: string;
  protected placeholderEmailRecovery: string;
  protected placeholderId: string;
  protected placeholderPhone: string;

  protected titleFarmData: string;
  protected placeholderNameFarm: string;

  protected titleUserData: string;
  protected placeholderPassword: string;
  protected placeholderPasswordC: string;
  protected placeholderNext: string;

  protected codeText: string;
  protected placeholderCode: string;
  protected placeholderRegister: string;

  protected formRegisterWithEmail;
  protected formRegisterWithSocialN;

  constructor(private formBuilder: FormBuilder, private routerActive: ActivatedRoute, private userService: UserServiceService, private router: Router) {
    this.title = "Registro de Usuarios";
    this.titlePersonalData = "Datos Personales";
    this.placeholderNames = "Nombres";
    this.placeholderLastNames = "Apellidos";
    this.placeholderEmail = "Correo Electrónico";
    this.placeholderEmailRecovery = "Correo Electrónico de recuperación";
    this.placeholderId = "Numero de identificación";
    this.placeholderPhone = "Numero de Teléfono";
    this.titleFarmData = "Datos de la Granja";
    this.placeholderNameFarm = "Nombre de la granja";
    this.titleUserData = "Datos de Usuario";
    this.placeholderPassword = "Contraseña";
    this.placeholderPasswordC = "Confirmación de contraseña";
    this.placeholderNext = "Siguiente";
    this.codeText = "Para finalizar el registro de tu nueva cuenta, revisa tu correo electrónico. Te hemos enviado un código de activación para registrar tu cuenta";
    this.placeholderCode = "Código de activación";
    this.placeholderRegister = "Registrar";
  }
  ngOnInit(): void {
    this.formRegisterWithEmail = this.formBuilder.group({
      names: ['', [
        Validators.required
      ]],
      lastnames: ['', [
        Validators.required
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      phone: ['', [
        Validators.required,
        Validators.pattern("^[0-9]{10,15}$")
      ]],
      id: ['', [
        Validators.required,
        Validators.pattern("^[0-9]{5,15}$")
      ]],
      pass: ['', [
        Validators.required,
        Validators.pattern("^(?=\\w*\\d)(?=\\w*[A-Z])(?=\\w*[a-z])\\S{8,16}$")
      ]],
      passC: ['', [
        Validators.required,
        Validators.pattern("^(?=\\w*\\d)(?=\\w*[A-Z])(?=\\w*[a-z])\\S{8,16}$")
      ]]
    }, {
      validators: equalsValidation
    });


    let namesSplit = this.routerActive.snapshot.params['name'] != undefined ? this.routerActive.snapshot.params['name'].split(' ') : undefined;
    let names: string = '';
    let lastnames: string = '';
    if (namesSplit != undefined) {
      for (let i = 0; i < namesSplit.length; i++) {
        if (i < namesSplit.length / 2) {
          names += namesSplit[i] + ' ';
        } else if (i >= namesSplit.length / 2) {
          lastnames += namesSplit[i] + ' ';
        }
      }
      names = names.trim();
      lastnames = lastnames.trim();
    }

    this.formRegisterWithSocialN = this.formBuilder.group({
      namesSocial: [names, [
        Validators.required
      ]],
      lastnamesSocial: [lastnames, [
        Validators.required
      ]],
      emailSocial: [this.routerActive.snapshot.params['email'] != undefined ? this.routerActive.snapshot.params['email'] : '', [
        Validators.required,
        Validators.email
      ]],
      phoneSocial: ['', [
        Validators.required,
        Validators.pattern("^[0-9]{10,15}$")
      ]],
      idSocial: ['', [
        Validators.required,
        Validators.minLength(5)
      ]]
    });
    if (this.routerActive.snapshot.params['email'] != undefined) {
      this.viewRegister = 2;
    } else {
      this.viewRegister = 0;
    }

  }

  changeView(index: number) {
    this.viewRegister = index;
  }

  registerUser(index) {
    if (index == 1) {
      this.userService.registerUser(false, this.formRegisterWithEmail.value['names'], this.formRegisterWithEmail.value['lastnames'], this.formRegisterWithEmail.value['email'], this.formRegisterWithEmail.value['phone'], this.formRegisterWithEmail.value['id'], this.formRegisterWithEmail.value['pass']);
    } else {
      this.userService.registerUser(true,this.formRegisterWithSocialN.value['namesSocial'], this.formRegisterWithSocialN.value['lastnamesSocial'], this.formRegisterWithSocialN.value['emailSocial'], this.formRegisterWithSocialN.value['phoneSocial'], this.formRegisterWithSocialN.value['idSocial'], '!8231cnas1ASd1');
    }

  }
}