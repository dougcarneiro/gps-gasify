import { Injectable } from '@angular/core';
import { Login } from '../../types/Login';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { IAuthService } from '../../../interfaces/auth-service.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthRestService implements IAuthService {

  LOGIN_URL = `${environment.apiUrl}/login`;
  REGISTER_URL = `${environment.apiUrl}/register`;

  constructor(private httpClient: HttpClient) { }

  login(email: string, password: string, code: string): Observable<Login> {
    const data = {
      email: email,
      password: password,
      code: code
    }
    return this.httpClient.post<Login>(`${this.LOGIN_URL}`, data);
  }

  register(name: string, email: string, password: string): Observable<Login> {
    const data = {
      name: name,
      email: email,
      password: password
    }
    return this.httpClient.post<Login>(`${this.REGISTER_URL}`, data);
  }
}
