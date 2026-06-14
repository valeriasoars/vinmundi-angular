import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-geografia-brasil',
  imports: [RouterLink],
  templateUrl: './geografia-brasil.html',
  styleUrl: './geografia-brasil.css',
})
export class GeografiaBrasil {
  ecraAtual: 'menu' | 'quiz-regiao' | 'info' = 'menu';

  abrirJogoRegioes() {
    this.ecraAtual = 'quiz-regiao';
  }

  voltarAoMenu() {
    this.ecraAtual = 'menu';
  }
}
