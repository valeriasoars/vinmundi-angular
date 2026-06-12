import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../service/auth/auth';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);

  const { data } = await authService.getUsuarioAtual();

  if (data.user) {
    return true; 
  } else {
    router.navigate(['/home']); 
    return false; 
  }
};
