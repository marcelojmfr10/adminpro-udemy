import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, catchError } from 'rxjs/operators';

import { Usuario } from '../../models/usuario.model';
import { URL_SERVICIOS } from '../../config/config';

import Swal from 'sweetalert2';
import { SubirArchivoService } from '../subir-archivo.service';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;
  menu: any = [];

  constructor(public http: HttpClient, public router: Router,
              public subirArchivo: SubirArchivoService) {
    this.cargarStorage();
    // console.log('Servicio de usuario listo');
  }

  renuevaToken() {
    const url = `${URL_SERVICIOS}/login/renuevatoken?token=${this.token}`;
    return this.http.get(url).pipe(
      map((resp: any) => {
        this.token = resp.token;
        localStorage.setItem('token', this.token);
        console.log('token renovado');
        return true;
      }),
      catchError((err: any) => {
        // console.log(err.error.mensaje);
        this.router.navigate(['/login']);
        Swal.fire({
          icon: 'error',
          title: 'No se pudo renovar el token',
          text: 'No fue posible renovar el token'
        });
        return throwError(err);
      })
    );
  }

  estaLogueado() {
    return (this.token.length > 5) ? true : false;
  }

  cargarStorage() {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
      this.menu = JSON.parse(localStorage.getItem('menu'));
    } else {
      this.token = '';
      this.usuario = null;
      this.menu = [];
    }
  }

  guardarStorage(id: string, token: string, usuario: Usuario, menu: any) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('menu', JSON.stringify(menu));
    this.usuario = usuario;
    this.token = token;
    this.menu = menu;
  }

  logout() {
    this.usuario = null;
    this.token = '';
    this.menu = [];
    localStorage.removeItem('id');
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('menu');

    this.router.navigate(['/login']);
  }

  loginGoogle(token: string) {
    const url = `${URL_SERVICIOS}/login/google`;
    return this.http.post(url, { token }).pipe(
        map((resp: any) => {
          this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);
          // console.log(resp);
          return true;
        })
    );
  }

  login(usuario: Usuario, recordar: boolean = false) {
    if (recordar) {
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }
    const url = `${URL_SERVICIOS}/login`;
    return this.http.post(url, usuario).pipe(
        map((resp: any) => {
          // localStorage.setItem('id', resp.id);
          // localStorage.setItem('token', resp.token);
          // localStorage.setItem('usuario', JSON.stringify(resp.usuario));
          this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);
          return true;
        }),
        catchError((err: any) => {
          // console.log(err.error.mensaje);
          Swal.fire({
            icon: 'error',
            title: 'Error en el Login',
            text: err.error.mensaje
          });
          return throwError(err);
        })
    );
  }

  crearUsuario(usuario: Usuario) {
    const url = `${URL_SERVICIOS}/usuario`;
    return this.http.post(url, usuario).pipe(
      map((resp: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Usuario creado',
          text: usuario.email
        });
        return resp.usuario;
      }),
      catchError((err: any) => {
        // console.log(err.error.mensaje);
        Swal.fire({
          icon: 'error',
          title: err.error.mensaje,
          text: err.error.errors.message
        });
        return throwError(err);
      })
    );
  }

  actualizarUsuario(usuario: Usuario) {
    const url = `${URL_SERVICIOS}/usuario/${usuario._id}?token=${this.token}`;
    return this.http.put(url, usuario).pipe(
            map((resp: any) => {
              // this.usuario = resp.usuario;

              if (usuario._id === this.usuario._id) {
                const usuarioDB: Usuario = resp.usuario;
                this.guardarStorage(usuarioDB._id, this.token, usuarioDB, this.menu);
              }

              Swal.fire({
                icon: 'success',
                title: 'Usuario actualizado',
                text: usuario.nombre
              });

              return true;
            }),
            catchError((err: any) => {
              // console.log(err.error.mensaje);
              Swal.fire({
                icon: 'error',
                title: err.error.mensaje,
                text: err.error.errors.message
              });
              return throwError(err);
            })
    );
  }

  cambiarImagen(archivo: File, id: string) {
    this.subirArchivo.subirArchivo(archivo, 'usuarios', id)
            .then((resp: any) => {
              // console.log(resp);
              this.usuario.img = resp.usuario.img;
              Swal.fire({
                icon: 'success',
                title: 'Imagen actualizada',
                text: this.usuario.nombre
              });

              this.guardarStorage(id, this.token, this.usuario, this.menu);
            })
            .catch(resp => {
              console.error(resp);
            });
  }

  cargarUsuarios(desde: number = 0) {
    const url = `${URL_SERVICIOS}/usuario?desde=${desde}`;
    return this.http.get(url);
  }

  buscarUsuarios(termino: string) {
    const url = `${URL_SERVICIOS}/busqueda/coleccion/usuarios/${termino}`;
    return this.http.get(url).pipe(map((resp: any) => resp.usuarios));
  }

  borrarUsuario(id: string) {
    const url = `${URL_SERVICIOS}/usuario/${id}?token=${this.token}`;
    return this.http.delete(url).pipe(
      map( resp => {
        Swal.fire({
          title: 'Usuario borrado',
          text: `Usuario borrado correctamente`,
          icon: 'success'
        });

        return true;
      })
    );
  }
}
