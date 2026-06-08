import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { CountryList } from './pages/country-list/country-list';
import { CountryDetail } from './pages/country-detail/country-detail';
import { Quiz } from './pages/quiz/quiz';
import { QuizContinent } from './pages/quiz-continent/quiz-continent';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'country/:code', component: CountryDetail },
  { path: 'quiz', component: Quiz },
  { path: 'continente', component: QuizContinent }
];
