import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Hospital } from '../../models/hospital.model';
import { MedicoService } from '../../services/medico.service';
import { HospitalService } from '../../services/hospital.service';
import { Medico } from 'src/app/models/medico.model';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [
  ]
})
export class MedicoComponent implements OnInit {

  hospitales: Hospital[] = [];
  medico: Medico = new Medico('', '', '', '', '');
  hospital: Hospital = new Hospital('');

  constructor(public medicosService: MedicoService,
              public hospitalService: HospitalService,
              public router: Router,
              public activatedRoute: ActivatedRoute,
              public modalUploadService: ModalUploadService) {

    this.activatedRoute.params.subscribe(params => {
      const id = params['id'];

      if (id !== 'nuevo') {
        this.cargarMedico(id);
      }
    });
  }

  ngOnInit(): void {
    this.hospitalService.cargarHospitales()
        .subscribe(hospitales => this.hospitales = hospitales);

    this.modalUploadService.notificacion
        .subscribe((resp: any) => {
          // console.log(resp);
          this.medico.img = resp.medico.img;
        });
  }

  cargarMedico(id: string) {
    this.medicosService.cargarMedico(id)
        .subscribe(medico =>{
          this.medico = medico;
          this.medico.hospital = medico.hospital._id;
          this.cambioHospital(this.medico.hospital);
          console.log(medico);
        });
  }

  guardarMedico(f: NgForm) {
    // console.log(f.valid);
    // console.log(f.value);

    if (f.invalid) {
      return;
    }

    this.medicosService.guardarMedico(this.medico)
        .subscribe(medico => {
          console.log(medico);
          this.medico._id = medico._id;
          this.router.navigate(['/medico', medico._id]);
        });
  }

  cambioHospital(id: string) {
    // console.log(id);
    this.hospitalService.obtenerHospital(id)
        .subscribe(hospital => this.hospital = hospital);
  }

  cambiarFoto() {
    this.modalUploadService.mostrarModal('medicos', this.medico._id);
  }

}
