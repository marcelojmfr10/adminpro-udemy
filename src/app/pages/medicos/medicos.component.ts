import { Component, OnInit } from '@angular/core';
import { Medico } from '../../models/medico.model';
import { MedicoService } from '../../services/medico.service';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: []
})
export class MedicosComponent implements OnInit {

  medicos: Medico[] = [];
  constructor(public medicosService: MedicoService) { }

  ngOnInit(): void {
    this.cargarMedicos();
  }

  cargarMedicos() {
      this.medicosService.cargarMedicos()
      .subscribe(medicos => this.medicos = medicos);
  }

  buscarMedico(termino: string) {
    if (termino.length <= 0) {
      this.cargarMedicos();
      return;
    }

    this.medicosService.buscarMedicos(termino)
      .subscribe(medicos => this.medicos = medicos);
  }

  borrarMedico(medico: Medico) {
    this.medicosService.borrarMedico(medico._id)
      .subscribe(() => this.cargarMedicos());
  }
}
