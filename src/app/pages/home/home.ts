import { Component, inject } from '@angular/core';
import { Navbar } from "../../components/navbar/navbar";
import { ContinentBar } from "../../components/continent-bar/continent-bar";
import { Auth } from '../../service/auth/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [Navbar, ContinentBar],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
private readonly authService = inject(Auth);
private readonly router = inject(Router);

  async sair(){
  await this.authService.fazerLogout();
  this.router.navigate(['/login']);
}
}
