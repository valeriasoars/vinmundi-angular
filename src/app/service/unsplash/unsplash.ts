import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Unsplash {
  private http = inject(HttpClient);
  private url = environment.unsplashUrl;
  private key = environment.unsplashKey;

  getFotoPais(nomePais: string) {
    const endpoint = `${this.url}/search/photos?query=${nomePais}+landscape&orientation=landscape&per_page=1&client_id=${this.key}`;
    return this.http.get<any>(endpoint);
  }
}
