import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class Wikipedia {
  private readonly http = inject(HttpClient)
  private readonly apiUrl = environment.apiUrlWiki

  getResumoPais(nomePais: string): Observable<any> {
    const url = `${this.apiUrl}/summary/${encodeURIComponent(nomePais)}`;
    return this.http.get<any>(url);
  }

  getImagensPais(nomePais: string): Observable<any> {
    const url = `${this.apiUrl}/media-list/${encodeURIComponent(nomePais)}`;
    return this.http.get<any>(url);
  }
}
