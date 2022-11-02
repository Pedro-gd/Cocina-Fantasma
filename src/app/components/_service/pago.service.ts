import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pago } from 'src/app/models/pago';

@Injectable({
  providedIn: 'root'
})
export class PagoService {

  private backendURL: string = "http://localhost:8080/pago/";
  formData = new FormData();
   
  constructor(
    //HttpClient para proporcionar métodos que reciben datos del backend
    private httpClient: HttpClient
    ) { }
 
  //Methods
  findAllUsers(): Observable<Pago[]>{
    const complemento = "consultarTodos"
    return this.httpClient.get<Pago[]>(this.backendURL + complemento);
  }

  findAllUsersId(id: number): Observable<Pago>{
    const complemento = "consultarTodosId/"
    return this.httpClient.get<Pago>(this.backendURL + complemento + id);
  }


  create(pago: Pago): Observable<Pago[]>{
    const complemento = "crearPago"
    return this.httpClient.post<Pago[]>(this.backendURL + complemento, pago);
  }
}
