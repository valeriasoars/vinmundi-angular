import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Country } from '../../service/country/country';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../service/auth/auth';

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
  
  private searchSubject = new Subject<string>();
  private sub!: Subscription;

  ngOnInit() {
    this.sub = this.searchSubject.pipe(
      debounceTime(300),          
      distinctUntilChanged()      
    ).subscribe(termo => {
      this.countryService.setTermoBusca(termo);
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
