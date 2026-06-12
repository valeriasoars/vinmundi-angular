import { Component, inject, OnInit } from '@angular/core';
import { Auth } from '../../service/auth/auth';
import { Router } from '@angular/router';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  private readonly authService = inject(Auth);
  private readonly router = inject(Router);

  mensagem = '';

  ngOnInit() {
    const supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        this.router.navigate(['/home']); 
      }
    });
  }

  async entrarComGoogle() {
    this.mensagem = 'Redirecionando para o Google...';
    
    const { data, error } = await this.authService.loginComGoogle();

    if (error) {
      this.mensagem = 'Erro ao conectar com o Google: ' + error.message;
    }
  }
}
