import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../config/config';
import { map } from 'rxjs/operators';
import { UsuarioService } from './usuario/usuario.service';

import Swal from 'sweetalert2';
import { Medico } from '../models/medico.model';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  totalMedicos: number = 0;

  constructor(public http: HttpClient, public usuarioService: UsuarioService) { }

  cargarMedicos() {
    const url = `${URL_SERVICIOS}/medico`;
    return this.http.get(url).pipe(map(  (resp: any) => {
      this.totalMedicos = resp.total;
      return resp.medicos;
    }));
  }

  cargarMedico(id: string) {
    const url = `${URL_SERVICIOS}/medico/${id}`;
    return this.http.get(url).pipe(
      map( (resp: any) => resp.medico)
    );
  }

  buscarMedicos(termino: string) {
    const url = `${URL_SERVICIOS}/busqueda/coleccion/medicos/${termino}`;
    return this.http.get(url).pipe(map((resp: any) => resp.medicos));
  }

  borrarMedico(id: string) {
    const url = `${URL_SERVICIOS}/medico/${id}?token=${this.usuarioService.token}`;
    return this.http.delete(url).pipe(
      map( resp => {
        Swal.fire({
          icon: 'success',
          title: 'Médico Borrado',
          text: 'Médico borrado correctamente'
        });
      })
    );
  }

  guardarMedico(medico: Medico) {
    if (medico._id) {
      // actualizando
      const urlActualizar = `${URL_SERVICIOS}/medico/${medico._id}?token=${this.usuarioService.token}`;
      return this.http.put(urlActualizar, medico).pipe(
        map((resp: any) => {
          Swal.fire({
            icon: 'success',
            title: 'Médico Actualizado',
            text: medico.nombre
          });
          return resp.medico;
        })
      );

    } else {
      // creando
      const urlGuardar = `${URL_SERVICIOS}/medico?token=${this.usuarioService.token}`;
      return this.http.post(urlGuardar, medico).pipe(
        map((resp: any) => {
          Swal.fire({
            icon: 'success',
            title: 'Médico Creado',
            text: medico.nombre
          });
          return resp.medico;
        })
      );
    }
  }
}
