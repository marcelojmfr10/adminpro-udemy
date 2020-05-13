import { Component, OnInit } from '@angular/core';
import { Hospital } from '../../models/hospital.model';
import { HospitalService } from '../../services/hospital.service';

import Swal from 'sweetalert2';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit {

  hospitales: Hospital[] = [];
  constructor(public hospitalService: HospitalService,
              public modalUploadService: ModalUploadService) { }

  ngOnInit(): void {
    this.cargarHospitales();
    this.modalUploadService.notificacion
        .subscribe(() => this.cargarHospitales());
  }

  cargarHospitales() {
    this.hospitalService.cargarHospitales().subscribe(resp => {
      this.hospitales = resp;
    });
  }

  guardarHospital(hospital: Hospital) {
    this.hospitalService.actualizarHospital(hospital)
        .subscribe();
  }

  borrarHospital(hospital: Hospital) {
    this.hospitalService.borrarHospital(hospital._id)
        .subscribe(() => this.cargarHospitales());
  }

  buscarHospital(termino: string) {

    if (termino.length <= 0) {
      this.cargarHospitales();
      return;
    }

    this.hospitalService.buscarHospitales(termino)
    .subscribe(hospitales => this.hospitales = hospitales);
  }

  async crearHospital() {
    Swal.fire({
      title: 'Crear Hospital',
      text: 'Ingrese el nombre del hospital',
      icon: 'info',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      console.log(result);
      if (!result.value || String(result.value).length === 0) {
        return;
      }

      this.hospitalService.crearHospital(String(result.value))
      .subscribe(() => this.cargarHospitales());
    });
  }

  actualizarImagen(hospital: Hospital) {
    this.modalUploadService.mostrarModal('hospitales', hospital._id);
  }
}
