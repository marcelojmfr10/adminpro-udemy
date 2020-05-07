import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UsuarioService } from '../services/usuario/usuario.service';
import { Usuario } from '../models/usuario.model';

declare function init_plugins();
declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  recuerdame: boolean = false;
  email: string;
  auth2: any;

  constructor(public usuarioService: UsuarioService, public router: Router) { }

  ngOnInit(): void {
    init_plugins();
    this.googleInit();

    this.email = localStorage.getItem('email') || '';
    if (this.email.length > 1) {
      this.recuerdame = true;
    }
  }

  googleInit() {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: '296936106444-q921or6gat0utf6ard5i7en4csijbo3h.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });

      this.attachSigin(document.getElementById('btnGoogle'));
    });
  }

  attachSigin(element) {
    this.auth2.attachClickHandler(element, {}, (googleUser) => {
      // const profile = googleUser.getBasicProfile();
      const token = googleUser.getAuthResponse().id_token;
      // console.log(token);

      this.usuarioService.loginGoogle(token)
            .subscribe(resp => {
              // this.router.navigate(['/dashboard']);
              window.location.href = '#/dashboard'; // se uso esto y no el router ya que no se cargaba correctamente el template
            });
    });
  }

  ingresar(forma: NgForm) {
    if (forma.invalid) {
      return;
    }

    const usuario = new Usuario(null, forma.value.email, forma.value.password);

    this.usuarioService.login(usuario, forma.value.recuerdame)
      .subscribe(correcto => this.router.navigate(['/dashboard']));

    // console.log(forma.valid);
    // console.log(forma.value);
    // this.router.navigate(['/dashboard']);
  }

}
