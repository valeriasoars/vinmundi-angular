import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { CountryModel } from '../../models/country-model';

@Injectable({
  providedIn: 'root',
})
export class Country {
  private readonly http = inject(HttpClient)

  private readonly apiUrl = environment.apiUrl

  getAllCountries(): Observable<CountryModel[]>{
    return this.http.get<CountryModel[]>(
      `${this.apiUrl}/all?fields=name,region`
    )
  }
}
