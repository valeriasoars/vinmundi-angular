import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { CountryModel } from '../../models/country-model';

@Injectable({
  providedIn: 'root',
})
export class Country {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  private regiaoSelecionada = new BehaviorSubject<string>('');
  regiaoSelecionada$ = this.regiaoSelecionada.asObservable();

  private termoBusca = new BehaviorSubject<string>('');
  termoBusca$ = this.termoBusca.asObservable();

  private readonly headers = new HttpHeaders({
    Authorization: `Bearer ${environment.restCountriesApiKey}`,
  });

  getAllCountries(): Observable<CountryModel[]> {
    return this.http
      .get<any>(`${this.apiUrl}/countries/v5`, {
        headers: this.headers,
        params: new HttpParams().set('limit', '100'),
      })
      .pipe(
        switchMap((firstResponse) => {
          const meta = firstResponse.data.meta;
          const firstPage: CountryModel[] = firstResponse.data.objects;

          if (!meta.more) {
            return of(firstPage);
          }

          const totalPages = Math.ceil(meta.total / 100);
          const remainingRequests = [];

          for (let offset = 100; offset < meta.total; offset += 100) {
            const params = new HttpParams().set('limit', '100').set('offset', offset.toString());
            remainingRequests.push(
              this.http
                .get<any>(`${this.apiUrl}/countries/v5`, {
                  headers: this.headers,
                  params,
                })
                .pipe(map((r) => r.data.objects as CountryModel[])),
            );
          }

          return forkJoin(remainingRequests).pipe(map((pages) => [...firstPage, ...pages.flat()]));
        }),
      );
  }

  getCountryByCode(code: string): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/countries/v5/codes.alpha_3/${code.toUpperCase()}`, {
        headers: this.headers,
      })
      .pipe(map((response) => response.data.objects[0]));
  }

  getCountriesByRegion(region: string): Observable<CountryModel[]> {
    const params = new HttpParams().set('region', region).set('limit', '100');
    return this.http
      .get<any>(`${this.apiUrl}/countries/v5`, {
        headers: this.headers,
        params,
      })
      .pipe(map((response) => response.data.objects as CountryModel[]));
  }

  getCountriesByName(name: string): Observable<CountryModel[]> {
    return this.http
      .get<any>(`${this.apiUrl}/countries/v5/names.common`, {
        headers: this.headers,
        params: new HttpParams().set('q', name),
      })
      .pipe(map((response) => response.data.objects as CountryModel[]));
  }

  setRegiao(regiao: string) {
    this.regiaoSelecionada.next(regiao);
  }

  setTermoBusca(termo: string) {
    if (termo.trim().length > 0) {
      this.regiaoSelecionada.next('');
    }
    this.termoBusca.next(termo);
  }
}
