import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Domicilio } from 'src/app/models/domicilio';


@Injectable({
  providedIn: 'root'
})
export class DomicilioService {
  private backendURL: string = "http://localhost:8080/clienteDomicilio/";
  formData = new FormData();
   
  constructor(
    //HttpClient para proporcionar métodos que reciben datos del backend
    private httpClient: HttpClient
    ) { }
 
  //Methods
  findAllUsers(): Observable<Domicilio[]>{
    const complemento = "consultarTodos"
    return this.httpClient.get<Domicilio[]>(this.backendURL + complemento);
  }

  findAllUsersId(id: number): Observable<Domicilio>{
    const complemento = "consultarTodosId/"
    return this.httpClient.get<Domicilio>(this.backendURL + complemento + id);
  }


  create(pago: Domicilio): Observable<Domicilio>{
    const complemento = "crearDomicilio"
    return this.httpClient.post<Domicilio>(this.backendURL + complemento, pago);
  }
}
