import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { UserServiceService } from '../services/user-service.service';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { interval, timer } from 'rxjs'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  protected title;
  protected placeholder_username;
  protected placeholder_password;
  protected submit_text;
  protected forgot_password_text;
  protected signin_text;
  protected viewLogin: number;
  protected titleRecovery;
  protected securityText;
  protected emailText;
  protected placeholderemail;
  protected placeholderback;
  protected placeholderNext;
  protected emailSendText;
  protected seeInboxText;
  protected time;
  protected placeholderCode;
  protected placeholderResend;
  protected succefulIdenty;
  protected inputNewPass;
  protected inputNewPassConfirm;
  protected placeholderPassConfirm;
  protected placeholderSave;
  protected error;
  protected formLogin: FormGroup;

  protected emailRecovery;

  constructor(private userService: UserServiceService, private router: Router, private formBuilder: FormBuilder) {
    this.viewLogin = 0;
    this.title = "Iniciar Sesión";
    this.placeholder_username = "Correo Electrónico";
    this.placeholder_password = "Contraseña";
    this.submit_text = "Entrar";
    this.forgot_password_text = "¿Olvidé mi contraseña?";
    this.signin_text = "¿No tienes cuenta? Regístrate";

    this.titleRecovery = "Recuperación de la Cuenta";
    this.securityText = "Para proteger tu cuenta, SIGEAVI quiere asegurarse  de que realmente seas tú la persona que intenta acceder";
    this.emailText = "A continuación escribe el correo electrónico de tu cuenta:";
    this.placeholderemail = "Correo Electrónico";
    this.placeholderback = "atrás";
    this.placeholderNext = "continuar";

    this.emailSendText = "Revisa tu correo electrónico.";
    this.seeInboxText = "SIGEAVI te envió un código de confirmación a tu bandeja de entrada, si no aparece revisa la carpeta de SPAM.";
    this.placeholderCode = "Código de confirmación";
    this.placeholderResend = "reenviar";

    this.succefulIdenty = "Hemos confirmado tu identidad, A continuación restaura tu contraseña";
    this.inputNewPass = "Digita una nueva contraseña";
    this.inputNewPassConfirm = "Confirma tu nueva contraseña";
    this.placeholderPassConfirm = "Confirmación de contraseña";
    this.placeholderSave = "Guardar";
    this.error = false;

  }

  ngOnInit(): void {
    this.formLogin = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  changeViewLogin(index: number) {
    this.viewLogin = index;
  }

  startTimer(){
    let minutes = 5;
    let seconds = 0;

    this.time = '05:00';
    const count = interval(1000);

    let subscribe = count.subscribe( s =>{
      seconds-=1;
      if (seconds == -1) {
        minutes-=1;
        seconds = 59;
      }
      if (seconds < 10) {
        this.time = 0+''+minutes+':0'+seconds
      }else{
        this.time = 0+''+minutes+':'+seconds
      }
    });
    setTimeout(()=> subscribe.unsubscribe(), 300000);

  }

  login() {
    this.userService.loginWithEmailAndPassword(this.formLogin.value['email'], this.formLogin.value['password']);
  }

  loginWithGoogle() {
    this.userService.loginWithGoogle();
  }

  loginWithFacebook() {
    this.userService.loginWithFacebook();
  }

  verifyCode(code){
    this.userService.verifyCode(this.emailRecovery).subscribe(
      res=>{
        if (code == res[0].recoveryCode) {
          this.changeViewLogin(3);
        }else{
          Swal.fire({
            icon: 'error',
            text: 'El código ingresado no es correcto',
          });
        }
      }
    );
  }

  changePass(pass, passconfirm){
    if (pass == passconfirm) {
      this.userService.changePass(this.emailRecovery, pass).subscribe(
        res=>{
          if (res) {
            Swal.fire({
              icon: 'success',
              text: 'Contraseña actualizada correctamente',
              timer: 1500,
              showConfirmButton: false
            });
            this.router.navigate(['/home/news']);
          }else{
            Swal.fire({
              icon: 'error',
              text: 'Ha ocurrido un error',
              timer: 1500,
              showConfirmButton: false
            });
          }
        }
      );
    }else{
      Swal.fire({
        icon: 'error',
        text: 'Las contraseñas no son iguales',
        timer: 1500,
        showConfirmButton: false
      });
    }
  }

  verifyUser(email) {
    this.emailRecovery = email;
    this.userService.getUserWithSocialNetwork(email).subscribe(
      res => {
        console.log(res)
        switch (res) {
          case -1:
            Swal.fire({
              icon: 'error',
              text: 'El usuario no esta registrado en el sistema',
            });
            this.router.navigate(['/home/news']);
            break;
          case 0:
            Swal.fire({
              icon: 'question',
              text: 'Este usuario esta manejado por un servicio externo',
            });
            this.router.navigate(['/home/news']);
            break;
          case 1:
            this.startTimer();
            this.changeViewLogin(2);
            break;
        }
      }, err => {

      }
    );
  }

}
