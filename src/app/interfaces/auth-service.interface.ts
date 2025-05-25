import { Observable } from 'rxjs';
import { Login } from '../shared/types/Login';

export abstract class IAuthService {
  abstract login(email: string, password: string): Observable<Login>;
  abstract register(name: string, email: string, password: string): Observable<Login>;
}
