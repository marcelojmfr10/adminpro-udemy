import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscriber, Subscription } from 'rxjs';
import { retry, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [
  ]
})
export class RxjsComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  constructor() {
    // this.regresaObservable().pipe(retry(2)).
    this.subscription = this.regresaObservable().subscribe(numero => console.log('Subs', numero),
                                                           error => console.error('Error en el obs', error),
                                                           () => console.log('El obs termino!!'));
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    console.log('La página se va a cerrar');
    this.subscription.unsubscribe();
  }


  regresaObservable(): Observable<any> {
    return new Observable( (observer: Subscriber<any>) => {
      let contador = 0;

      const intervalo = setInterval( () => {
        contador += 1;

        const salida = {
          valor: contador
        };

        // observer.next(contador);
        // esto sirve para usar el operador map
        observer.next(salida);

        // if (contador === 3) {
        //   clearInterval(intervalo);
        //   observer.complete();
        // }

        // Esto sirvió para el retry
        // if (contador === 2) {
        //   // clearInterval(intervalo);
        //   observer.error('Auxilio');
        // }
      }, 1000);
    }).pipe(
      map(data => data.valor),
      filter((valor, index) => {
        // filter a puro tubo regresa un boolean
        // console.log('Filter', valor, index);
        if ((valor % 2) === 1) {
          // impar
          return true;
        } else {
          // par
          return false;
        }
        // return true;
      })
    );
  }
}
