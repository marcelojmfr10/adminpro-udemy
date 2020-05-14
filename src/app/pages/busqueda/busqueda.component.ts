import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';
import { Usuario } from '../../models/usuario.model';
import { Medico } from '../../models/medico.model';
import { Hospital } from 'src/app/models/hospital.model';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: [
  ]
})
export class BusquedaComponent implements OnInit {

  usuarios: Usuario[] = [];
  medicos: Medico[] = [];
  hospitales: Hospital[] = [];

  constructor(public activatedRoute: ActivatedRoute,
              public http: HttpClient) {
    this.activatedRoute.params.subscribe(params => {
      const termino = params['termino'];
      // console.log(termino);
      this.buscar(termino);
    });
  }

  ngOnInit(): void {
  }

  buscar(termino: string) {
    const url = `${URL_SERVICIOS}/busqueda/todo/${termino}`;
    this.http.get(url).subscribe( (resp: any) => {
      console.log(resp);
      this.hospitales = resp.hospitales;
      this.medicos = resp.medicos;
      this.usuarios = resp.usuarios;
    });
  }

}
