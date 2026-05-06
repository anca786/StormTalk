# StormTalk

StormTalk este o aplicatie web care integreaza date meteorologice obtinute in timp real prin API cu o arhitectura AI multi-agent. Aplicatia foloseste doi agenti virtuali: Weather Advisor pentru recomandari meteo contextualizate si Vacation Finder pentru sugestii de destinatii pe baza preferintelor utilizatorului.

## Demo

- Live demo: de adaugat dupa deploy pe Vercel
- Video demo offline: de adaugat dupa screencast
- Repository: https://github.com/anca786/StormTalk

## Membrii echipei

- Staicu Octavian Stefan
- Tanasoiu Maria Alexia
- Bizon Anca Elena

## Stack tehnic

- Next.js + TypeScript
- Open-Meteo pentru date meteo
- Gemini API pentru agentii AI
- Supabase pentru autentificare, favorite si istoric
- Leaflet + OpenStreetMap pentru harta interactiva
- GitHub Actions pentru CI
- Vercel pentru deploy

## Functionalitati principale

- Explorare pe harta interactiva globala
- Selectare punct pe harta si vizualizare vreme curenta
- Doi agenti AI: Weather Advisor si Vacation Finder
- Modul Smart Vacation Finder
- Autentificare si profil utilizator
- Favorite si istoric al conversatiilor
- Preferinte pentru unitati de temperatura

## Stadiu actual

- Harta interactiva cu selectie prin click
- Open-Meteo integrat prin API route proprie
- Weather Advisor cu fallback local daca serviciul LLM nu raspunde
- Vacation Finder cu fallback local pentru destinatii daca serviciul LLM nu raspunde
- Login demo si autentificare Supabase pe email/parola
- Persistenta pentru profil, favorite si istoric
- CI de baza prin GitHub Actions
- Teste unitare pentru prompturi, storage si weather helpers

## User Stories / Product Backlog

### EPIC 1: Live Map & Weather Discovery

Goal: Allow users to visually explore global weather conditions easily.

- User Story 1.1: As a user, I want to explore an interactive global map so that I can visually locate interesting weather events worldwide.
- User Story 1.2: As a user, I want to drop a pin anywhere on the map so that I can instantly see the current weather conditions for that exact location.

### EPIC 2: The AI Show

Goal: Provide an entertaining and informative commentary on the weather.

- User Story 2.1: As a user, I want to receive a Weather Advisor analysis when I select a location on the map, so that I can understand the current conditions and practical recommendations.
- User Story 2.2: As a user, I want the AI commentary to be based on accurate, real-time weather data, so that the advice and banter reflect the actual conditions outside.

### EPIC 3: Smart Vacation Finder

Goal: Help users dynamically discover destinations that match their ideal weather.

- User Story 3.1: As a traveler, I want to filter map locations by my ideal temperature and wind speed, so that I can quickly find the perfect spot for my holiday right now.
- User Story 3.2: As a traveler, I want the Vacation Finder agent to summarize each matched destination using real forecast data, so that I get practical travel advice before packing my bags.

### EPIC 4: Personalization, History & Favorites

Goal: Keep users engaged by saving their preferences and favorite moments.

- User Story 4.1: As a user, I want to create an account and log in, so that my history and preferences are saved across different devices.
- User Story 4.2: As a user, I want to toggle between Celsius and Fahrenheit in my profile, so that the AI agents use the temperature units I understand.
- User Story 4.3: As a user, I want to save specific locations to a Favorites list, so that I can easily monitor the weather and AI commentary for places I care about.
- User Story 4.4: As a user, I want to view a chronological history of my recently checked locations and AI analyses, so that I can easily re-read useful recommendations.

## Structura proiectului

```txt
app/
  api/
  favorites/
  history/
  login/
  map/
  profile/
components/
hooks/
docs/
lib/
supabase/
tests/
```

## Arhitectura pe scurt

1. Utilizatorul selecteaza o locatie pe harta.
2. Aplicatia cere datele meteo curente din `Open-Meteo`.
3. Datele sunt trimise catre endpointul intern `/api/debate`.
4. Endpointul orchestreaza agentul `Weather Advisor`, care genereaza recomandari meteo practice.
5. Rezultatul este afisat in UI si salvat in `history`.
6. Utilizatorul poate salva locatia in `favorites`.
7. In `/vacation`, agentul `Vacation Finder` recomanda destinatii si foloseste prognoza reala pentru rezumatul fiecarei optiuni.

## Ce API-uri folosim

- Weather: `Open-Meteo`
- AI: `Gemini API` si `Groq API`, cu fallback local in aplicatie
- Auth si DB: `Supabase`
- Harta: `Leaflet` + `OpenStreetMap`

## Cerinte proiect si dovezi in repository

### A. Implementare

- Live demo: aplicatia este pregatita pentru deploy pe Vercel
- Doi agenti AI inclusi in functionalitate: `Weather Advisor` si `Vacation Finder`
- Demo offline: se va adauga linkul catre video
- Functionalitate curenta demonstrabila:
  - selectie locatie pe harta
  - weather live
  - analiza AI meteo
  - recomandari AI de vacanta
  - favorite
  - history
  - auth

### B. Procesul de dezvoltare software cu AI

- User stories + backlog: README + Trello + documente din `docs/`
- Diagrame: `docs/architecture.md` si viitoarele exporturi din `docs/diagrams/`
- Git workflow: `docs/git-workflow.md`
- Teste automate: `tests/`
- Evals pentru agenti: baze puse in testele de prompturi si fallback
- Bug report + fix PR: `docs/report/bug-report.md` + GitHub Issues / Pull Requests
- CI/CD: workflow GitHub Actions in `.github/workflows/`
- Raport despre folosirea toolurilor AI: `docs/report/ai-usage-report.md`

## Variabile de mediu

Copiati `.env.example` in `.env.local` si completati:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GEMINI_API_KEY=
```

## Baza de date Supabase

Rulati scriptul din `supabase/schema.sql` in `SQL Editor`.

Scriptul creeaza:
- tabelele `profiles`, `favorites`, `history`
- constrangeri pentru coordonate si unitati
- indexuri utile pentru interogarile frecvente
- politici RLS de baza pentru accesul la datele utilizatorului

## Rulare locala

```bash
npm install
npm run dev
```

## Verificare rapida

```bash
npm run lint
npm run test
npm run typecheck
npm run build
```

## Flux de utilizare

1. Deschizi `/login`
2. Creezi cont sau folosesti login demo
3. Intri pe `/map`
4. Selectezi un punct pe harta
5. Vezi vremea curenta si analiza Weather Advisor
6. Salvezi favorite si generezi istoric
7. Verifici `/favorites`, `/history`, `/profile`

## Linkuri utile

- Weather API: https://open-meteo.com/
- Gemini API: https://ai.google.dev/
- Supabase: https://supabase.com/
- Leaflet: https://leafletjs.com/
- Trello: Project tasks and backlog are managed on Trello.
