import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

import { Usuario } from '../../models/usuario.model';
import { URL_SERVICIOS } from '../../config/config';

import Swal from 'sweetalert2';
import { SubirArchivoService } from '../subir-archivo.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;

  constructor(public http: HttpClient, public router: Router,
              public subirArchivo: SubirArchivoService) {
    this.cargarStorage();
    // console.log('Servicio de usuario listo');
  }

  estaLogueado() {
    return (this.token.length > 5) ? true : false;
  }

  cargarStorage() {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
    } else {
      this.token = '';
      this.usuario = null;
    }
  }

  guardarStorage(id: string, token: string, usuario: Usuario) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));

    this.usuario = usuario;
    this.token = token;
  }

  logout() {
    this.usuario = null;
    this.token = '';
    localStorage.removeItem('id');
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    this.router.navigate(['/login']);
  }

  loginGoogle(token: string) {
    const url = `${URL_SERVICIOS}/login/google`;
    return this.http.post(url, { token }).pipe(
        map((resp: any) => {
          this.guardarStorage(resp.id, resp.token, resp.usuario);
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
          this.guardarStorage(resp.id, resp.token, resp.usuario);
          return true;
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
                this.guardarStorage(usuarioDB._id, this.token, usuarioDB);
              }

              Swal.fire({
                icon: 'success',
                title: 'Usuario actualizado',
                text: usuario.nombre
              });

              return true;
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

              this.guardarStorage(id, this.token, this.usuario);
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
