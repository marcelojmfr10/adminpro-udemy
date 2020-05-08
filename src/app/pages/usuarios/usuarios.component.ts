import { Component, OnInit } from '@angular/core';

import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];
  desde: number = 0;
  totalRegistros: number = 0;
  cargando: boolean = true;
  constructor(public usuarioService: UsuarioService,
              public modalUploadService: ModalUploadService) { }

  ngOnInit(): void {
    this.cargarUsuarios();
    this.modalUploadService.notificacion
          .subscribe(resp => this.cargarUsuarios());
  }

  mostrarModal(id: string) {
    this.modalUploadService.mostrarModal('usuarios', id);
  }

  cargarUsuarios() {
    this.cargando = true;
    this.usuarioService.cargarUsuarios(this.desde)
          .subscribe((resp: any) => {
            // console.log(resp);
            this.totalRegistros = resp.total;
            this.usuarios = resp.usuarios;
            this.cargando = false;
          });
  }

  cambiarDesde(valor: number) {
    const desde = this.desde + valor;
    // console.log(desde);

    if (desde >= this.totalRegistros) { return; }

    if (desde < 0) { return; }

    this.desde += valor;
    this.cargarUsuarios();
  }

  buscarUsuario(termino: string) {
    // console.log(termino);
    if (termino.length <= 0) {
      this.cargarUsuarios();
      return;
    }

    this.cargando = true;

    this.usuarioService.buscarUsuarios(termino)
        .subscribe((usuarios: Usuario[]) => {
          // console.log(usuarios);
          this.usuarios = usuarios;
          this.cargando = false;
        });
  }

  borrarUsuario(usuario: Usuario) {
    // sconsole.log(usuario);
    if (usuario._id === this.usuarioService.usuario._id){
      Swal.fire({
        icon: 'error',
        title: 'No puede borrar usuario',
        text: 'No se puede borrar a sí mismo'
      });

      return;
    }

    Swal.fire({
      title: '¿Está seguro?',
      text: `¿Está seguro que desea borrar a ${usuario.nombre}`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then( resp => {
      if (resp.value) {
        // console.log(resp);
        this.usuarioService.borrarUsuario(usuario._id)
                .subscribe(borrado => {
                  console.log(borrado);
                  this.cargarUsuarios();
                });
      }
    });
  }

  guardarUsuario(usuario: Usuario) {
    this.usuarioService.actualizarUsuario(usuario)
          .subscribe();

  }
}
