import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Country } from '../../service/country/country';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../service/auth/auth';
import { Progression } from '../../service/progression/progression';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit, OnDestroy {
  private readonly countryService = inject(Country);
  private readonly authService = inject(Auth); 
  private readonly router = inject(Router);
  private readonly progressionService = inject(Progression);
  private readonly cdr = inject(ChangeDetectorRef);
  
  private searchSubject = new Subject<string>();
  private sub = new Subscription();

  nivelAtual = 1;
  xpTotal = 0;
  porcentagemBarra = 0;

 ngOnInit() {
    this.sub.add(
      this.searchSubject.pipe(
        debounceTime(300),
        distinctUntilChanged()
      ).subscribe(termo => this.countryService.setTermoBusca(termo))
    );

    this.sub.add(
      this.progressionService.perfil$.subscribe(perfil => {
        this.nivelAtual = perfil.nivel;
        this.xpTotal = perfil.xpTotal;
        this.porcentagemBarra = this.xpTotal % 100;
        this.cdr.detectChanges(); 
      })
    );

    this.progressionService.getPerfilJogador().subscribe(perfil => {
      this.progressionService.atualizarPerfil(perfil);
      this.progressionService['perfilSubject'].next({
        xpTotal: perfil.xpTotal,
        nivel: perfil.nivel,
        xpProximoNivel: perfil.xpProximoNivel
      });
    });
  }

 onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchSubject.next(input.value); 
  }

  async sair() {
    await this.authService.fazerLogout();
    this.router.navigate(['/login']); 
  }

  ngOnDestroy() {
    this.sub.unsubscribe(); 
  }
}
