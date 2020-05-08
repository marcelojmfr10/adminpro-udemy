import { Component, OnInit } from '@angular/core';

import Swal from 'sweetalert2';
import { SubirArchivoService } from '../../services/subir-archivo.service';
import { ModalUploadService } from './modal-upload.service';

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: [
  ]
})
export class ModalUploadComponent implements OnInit {

  // oculto: string = '';
  imagenSubir: File;
  imagenTemp: string | ArrayBuffer;

  constructor(public subirArchivoService: SubirArchivoService,
              public modalUploadService: ModalUploadService) {
   }

  ngOnInit(): void {
  }

  cerrarModal() {
    this.imagenTemp = null;
    this.imagenSubir = null;

    this.modalUploadService.ocultarModal();
  }

  seleccionImagen(archivo: File) {
    if (!archivo) { return; }
    // console.log(event);
    // console.log(archivo);
    if (archivo.type.indexOf('image') < 0) {
      Swal.fire({
        icon: 'error',
        title: 'Sólo imágenes',
        text: 'El archivo seleccionado no es una imagen'
      });
      this.imagenSubir = null;
      return;
    }

    this.imagenSubir = archivo;
    const reader = new FileReader();
    const urlImagenTemp = reader.readAsDataURL(archivo);
    reader.onloadend = () => this.imagenTemp = reader.result;
  }

  subirImagen() {
    this.subirArchivoService.subirArchivo(this.imagenSubir,
      this.modalUploadService.tipo, this.modalUploadService.id)
      .then( resp => {
        console.log(resp);
        this.modalUploadService.notificacion.emit(resp);
        this.cerrarModal();
        // this.modalUploadService.ocultarModal();
      })
      .catch(err => {
        console.error('Error en la carga');
      });
  }
}
