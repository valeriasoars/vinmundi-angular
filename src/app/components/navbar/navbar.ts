import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Country } from '../../service/country/country';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit, OnDestroy {
  private readonly countryService = inject(Country);
  
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

  ngOnDestroy() {
    this.sub.unsubscribe(); 
  }
}
