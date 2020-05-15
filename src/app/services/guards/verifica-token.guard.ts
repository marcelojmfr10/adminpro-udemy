import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class VerificaTokenGuard implements CanActivate {

  constructor(public usuarioService: UsuarioService,
              public router: Router) {}

  canActivate(): Promise<boolean> | boolean {
    // console.log('Token guard');
    const token = this.usuarioService.token;
    const payload = JSON.parse(atob(token.split('.')[1]));
    // console.log(payload);
    const expirado = this.expirado(payload.exp);

    if (expirado) {
      this.router.navigate(['/login']);
      return false;
    }

    return this.verificaRenueva(payload.exp);
  }

  verificaRenueva(fechaExpiracion: number): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const tokenExpira = new Date(fechaExpiracion * 1000);
      const ahora = new Date();

      ahora.setTime(ahora.getTime() + (4 * 60 * 60 * 1000));
      // console.log(tokenExpira);
      // console.log(ahora);

      if (tokenExpira.getTime() > ahora.getTime()) {
        resolve(true);
      } else {
        // el token está próximo a vencer
        this.usuarioService.renuevaToken()
            .subscribe(() => resolve(true), () => {
              this.router.navigate(['/login']);
              reject(false);
            });
      }

      resolve(true);
    });
  }

  expirado(fechaExpiracion: number) {
    const ahora = new Date().getTime() / 1000; // milisegundos
    if (fechaExpiracion < ahora) {
      return true;
    } else {
      return false;
    }
  }
}
