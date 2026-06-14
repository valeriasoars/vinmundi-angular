import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment.development';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { ContinentProgressModel } from '../../models/progress-model';

@Injectable({
  providedIn: 'root',
})
export class Progression {
  private supabase: SupabaseClient;

  private perfilSubject = new BehaviorSubject({ xpTotal: 0, nivel: 1, xpProximoNivel: 100 });

  public perfil$ = this.perfilSubject.asObservable();

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    this.carregarPerfilInicial();
  }

  getProgress(regionId: string): Observable<ContinentProgressModel> {
    return from(
      this.supabase.auth.getUser().then(async ({ data: { user } }) => {
        if (!user) return { bandeiras: null, capitais: null, silhuetas: null };

        const { data, error } = await this.supabase
          .from('continent_progress')
          .select('score_flags, score_capitals, score_silhouettes, visa_unlocked')
          .eq('user_id', user.id)
          .eq('region_id', regionId)
          .maybeSingle();

        if (error || !data) return { bandeiras: null, capitais: null, silhuetas: null };

        return {
          bandeiras: data.score_flags,
          capitais: data.score_capitals,
          silhuetas: data.score_silhouettes,
          visa_unlocked: data.visa_unlocked,
        };
      }),
    );
  }

  getAllProgress(): Observable<any[]> {
    return from(
      this.supabase.auth.getUser().then(async ({ data: { user } }) => {
        if (!user) return [];
        
        const { data } = await this.supabase
          .from('continent_progress')
          .select('region_id, score_flags, score_capitals, score_silhouettes')
          .eq('user_id', user.id);
          
        return data || [];
      })
    );
  }

  saveScore(
    regionId: string,
    tipo: 'bandeiras' | 'capitais' | 'silhuetas',
    score: number,
  ): Observable<void> {
    return from(
      this.supabase.auth.getUser().then(async ({ data: { user } }) => {
        if (!user) return;

        const { data: currentData } = await this.supabase
          .from('continent_progress')
          .select('score_flags, score_capitals, score_silhouettes')
          .eq('user_id', user.id)
          .eq('region_id', regionId)
          .maybeSingle();

        const currentScore = currentData
          ? currentData[
              `score_${tipo === 'bandeiras' ? 'flags' : tipo === 'capitais' ? 'capitals' : 'silhouettes'}`
            ]
          : 0;

        if (score > (currentScore || 0)) {
          const colunas = {
            bandeiras: 'score_flags',
            capitais: 'score_capitals',
            silhuetas: 'score_silhouettes',
          };

          await this.supabase.from('continent_progress').upsert(
            {
              user_id: user.id,
              region_id: regionId,
              [colunas[tipo]]: score,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id, region_id' },
          );
        }
      }),
    );
  }

  calcularNivel(xp: number): number {
    return Math.floor(xp / 100) + 1;
  }

  processarXpDaRodada(acertos: number): Observable<{ xpGanho: number; subiuDeNivel: boolean }> {
    let xpGanho = acertos * 10;
    if (acertos === 10) xpGanho += 50;
    else if (acertos >= 7) xpGanho += 30;

    return from(
      this.supabase.auth.getUser().then(async ({ data: { user } }) => {
        if (!user) return { xpGanho: 0, subiuDeNivel: false };

        const xpAtual = this.perfilSubject.value.xpTotal;
        const nivelAntigo = this.calcularNivel(xpAtual);

        const novoXpTotal = xpAtual + xpGanho;
        const nivelNovo = this.calcularNivel(novoXpTotal);

        await this.supabase.from('player_stats').upsert({
          user_id: user.id,
          total_xp: novoXpTotal,
          updated_at: new Date().toISOString(),
        });

        this.perfilSubject.next({
          xpTotal: novoXpTotal,
          nivel: nivelNovo,
          xpProximoNivel: nivelNovo * 100 - novoXpTotal,
        });

        return { xpGanho, subiuDeNivel: nivelNovo > nivelAntigo };
      }),
    );
  }

  getPerfilJogador(): Observable<{ xpTotal: number; nivel: number; xpProximoNivel: number }> {
    return from(
      this.supabase.auth.getUser().then(async ({ data: { user } }) => {
        if (!user) return { xpTotal: 0, nivel: 1, xpProximoNivel: 100 };

        const { data } = await this.supabase
          .from('player_stats')
          .select('total_xp')
          .eq('user_id', user.id)
          .maybeSingle();

        const xp = data?.total_xp || 0;
        const nivel = this.calcularNivel(xp);

        return {
          xpTotal: xp,
          nivel: nivel,
          xpProximoNivel: nivel * 100 - xp,
        };
      }),
    );
  }

  private async carregarPerfilInicial() {
    const {
      data: { user },
    } = await this.supabase.auth.getUser();
    if (!user) return;

    const { data } = await this.supabase
      .from('player_stats')
      .select('total_xp')
      .eq('user_id', user.id)
      .maybeSingle();

    const xp = data?.total_xp || 0;
    const nivel = this.calcularNivel(xp);
    
    this.perfilSubject.next({
      xpTotal: xp,
      nivel: nivel,
      xpProximoNivel: nivel * 100 - xp,
    });
  }

  atualizarPerfil(perfil: { xpTotal: number; nivel: number; xpProximoNivel: number }) {
    this.perfilSubject.next(perfil);
  }
}
