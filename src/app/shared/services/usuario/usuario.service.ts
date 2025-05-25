import { Injectable } from '@angular/core';
import {Usuario} from '../../model/Usuario';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  URL = `${environment.apiUrl}/listaUsuarios`;

  constructor(private httpClient: HttpClient) {

  }

  listar(): Observable<Usuario[]> {
    return this.httpClient.get<Usuario[]>(this.URL);
  }

  inserir(usuario: Usuario): Observable<Usuario> {
    return this.httpClient.post<Usuario>(this.URL, usuario);
  }

}
