import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { CountryList } from './pages/country-list/country-list';
import { CountryDetail } from './pages/country-detail/country-detail';

import { QuizContinent } from './pages/quiz/quiz-continent/quiz-continent';
import { GeografiaBrasil } from './pages/geografia-brasil/geografia-brasil';
import { Login } from './pages/login/login';
import { authGuard } from './guards/auth-guard';
import { Continent } from './pages/continent/continent';
import { QuizBandeiras } from './pages/quiz/quiz-bandeiras/quiz-bandeiras';

export const routes: Routes = [

  { path: 'login', component: Login },
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  { path: 'home', component: Home, canActivate: [authGuard] },
  { path: 'country/:code', component: CountryDetail,canActivate: [authGuard] },
  { path: 'continente', component: QuizContinent, canActivate: [authGuard] },
  { path: 'geografia-brasil', component: GeografiaBrasil, canActivate: [authGuard] },
  { path: 'continente/:regiao', component: Continent, canActivate: [authGuard]},
  { path: 'quiz/:regiao/:tipo', component: QuizBandeiras, canActivate: [authGuard] },

];
