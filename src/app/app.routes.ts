import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { CountryList } from './pages/country-list/country-list';
import { CountryDetail } from './pages/country-detail/country-detail';
import { Quiz } from './pages/quiz/quiz';
import { QuizContinent } from './pages/quiz-continent/quiz-continent';
import { GeografiaBrasil } from './pages/geografia-brasil/geografia-brasil';
import { Login } from './pages/login/login';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [

  { path: 'login', component: Login },
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  { path: 'home', component: Home, canActivate: [authGuard] },
  { path: 'country/:code', component: CountryDetail,canActivate: [authGuard] },
  { path: 'quiz', component: Quiz, canActivate: [authGuard] },
  { path: 'continente', component: QuizContinent,canActivate: [authGuard] },
  { path: 'geografia-brasil', component: GeografiaBrasil, canActivate: [authGuard] },

];
