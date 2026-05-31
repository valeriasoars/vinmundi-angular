import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { CountryModel } from '../../models/country-model';

@Injectable({
  providedIn: 'root',
})
export class Country {
  private readonly http = inject(HttpClient)
  private readonly apiUrl = environment.apiUrl

  private regiaoSelecionada = new BehaviorSubject<string>('');
  regiaoSelecionada$ = this.regiaoSelecionada.asObservable();

  private termoBusca = new BehaviorSubject<string>('');
  termoBusca$ = this.termoBusca.asObservable();

  getAllCountries(): Observable<CountryModel[]>{
    return this.http.get<CountryModel[]>(
      `${this.apiUrl}/all?fields=name,region`
    )
  }

  getCountryByCode(code: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/alpha/${code}`);
  }

  getCountriesByRegion(region: string): Observable<CountryModel[]> {
      return this.http.get<CountryModel[]>(
        `${this.apiUrl}/region/${region}?fields=flags,name,population,capital,region,cca3,borders`
      );
  }

  getCountriesByName(name: string): Observable<CountryModel[]> {
    return this.http.get<CountryModel[]>(
      `${this.apiUrl}/name/${name}?fields=flags,name,population,capital,region,cca3,borders`
    );
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
