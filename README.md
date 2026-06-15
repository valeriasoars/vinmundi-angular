#  Passaporte Global: Desafio Geográfico

Uma aplicação web gamificada construída com **Angular** e **Supabase**, projetada para testar e expandir conhecimentos geográficos de forma imersiva. Com um design baseado no estilo **Neo-brutalista**, o jogador explora continentes, estuda cada país e enfrenta missões de reconhecimento (bandeiras, capitais e silhuetas) para conquistar o cobiçado **Visto Mundial**.

---

## Objetivo do Projeto

Criar uma experiência educativa e interativa que vai além de um simples quiz. A aplicação funciona como um sistema completo: gera perfis de utilizador, calcula pontos de experiência (XP), avança níveis e guarda o progresso do jogador em tempo real na base de dados. É a união entre consumo de múltiplas APIs públicas e a gestão de estado complexa com serviços em Angular.

---

##  Funcionalidades

###  Exploração Continental
Navegação intuitiva separada pelos continentes: África, Américas, Ásia, Europa e Oceania.

###  Dossiês de Inteligência (Detalhe do País)
Consulta de dados detalhados de qualquer país do mundo, cruzando dados de três APIs diferentes para entregar área, população, fronteiras, resumo histórico (Wikipedia) e imagens reais do território (Unsplash).

###  Missões de Reconhecimento
Quizzes interativos divididos em três categorias por continente:
- 🚩 Identificação de Bandeiras
- 🏙️ Conhecimento de Capitais
- 🗾 Reconhecimento de Silhuetas Territoriais

### Sistema de Progressão e XP
O utilizador ganha XP conforme a sua taxa de acerto, subindo de nível.

### Passaporte e Vistos
Ao concluir 3 missões num continente com alta pontuação, o jogador conquista o visto daquela região.

### Exame Global
Ao desbloquear os 5 vistos continentais, a arena final é libertada: um teste para o usuario conseuistar o visto mundial

---

##  Tecnologias e Dependências

| Categoria | Tecnologia |
|---|---|
| Front-end | Angular 21 (Standalone Components, Signals, RxJS) |
| Back-end & Auth | Supabase (PostgreSQL, Supabase Auth) |
| Dados geográficos | REST Countries API v5 |
| Imagens | Unsplash API |
| Resumos históricos | Wikipedia REST API |
| Design | CSS puro |

---

##  Como Executar o Projeto Localmente

### 1. Pré-requisitos

Certifique-se de ter o **Node.js** e o **Angular CLI** instalados:

```bash
npm install -g @angular/cli
```

### 2. Clonar o Repositório e Instalar Dependências

```bash
git clone https://github.com/seu-usuario/passaporte-global.git
cd passaporte-global
npm install
```

### 3. Configuração das Variáveis de Ambiente

Na pasta `src/environments/`, crie o arquivo `environment.development.ts` com a seguinte estrutura:

```typescript
export const environment = {
  apiUrl: 'https://api.restcountries.com',
  restCountriesApiKey: 'SUA_CHAVE_AQUI',
  apiUrlWiki: 'https://pt.wikipedia.org/api/rest_v1/page',
  unsplashUrl: 'https://api.unsplash.com',
  unsplashKey: 'COLOQUE_A_SUA_CHAVE_AQUI',
  supabaseUrl: 'SUA_URL_DO_SUPABASE_AQUI',
  supabaseKey: 'SUA_ANON_KEY_DO_SUPABASE_AQUI'
};
```

> **Nota:** Crie também o arquivo `environment.ts` com `production: true` e as mesmas chaves para o deploy em produção.

### 4. Configuração da Base de Dados (Supabase)

Crie as seguintes tabelas no seu projeto Supabase:

**`player_stats`**
| Coluna | Tipo |
|---|---|
| user_id | uuid |
| total_xp | integer |
| visto_mundial_desbloqueado | boolean |
| updated_at | timestamp |

**`continent_progress`**
| Coluna | Tipo |
|---|---|
| user_id | uuid |
| region_id | text |
| score_flags | integer |
| score_capitals | integer |
| score_silhouettes | integer |
| updated_at | timestamp |

### 5. Iniciar o Servidor

```bash
ng serve
```

A aplicação estará disponível em **http://localhost:4200/**.

---
