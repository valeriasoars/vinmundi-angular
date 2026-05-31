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

  getAllCountries(): Observable<CountryModel[]>{
    return this.http.get<CountryModel[]>(
      `${this.apiUrl}/all?fields=name,region`
    )
  }

  getCountriesByRegion(region: string): Observable<CountryModel[]> {
      return this.http.get<CountryModel[]>(
        `${this.apiUrl}/region/${region}?fields=flags,name,population,capital,region,cca3,borders`
      );
    }

  setRegiao(regiao: string) {
    this.regiaoSelecionada.next(regiao);
  }
}
