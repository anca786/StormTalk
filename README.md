# StormTalk ⛈️

StormTalk este o aplicatie web inovatoare care integreaza date meteorologice obtinute in timp real cu o arhitectura AI multi-agent. Aplicatia orchestreaza agenti virtuali care analizeaza parametrii climatici si genereaza contextual analize meteo pentru orice coordonate geografice selectate pe harta, alaturi de functionalitati de planificare a vacantelor in functie de clima.

## Grila de Evaluare & Dovezi Implementare

Acest fișier acționează ca un index rapid pentru a facilita verificarea tuturor cerințelor proiectului:

### A. Implementarea

| Cerință | Status | Dovadă / Fișier |
|---------|--------|----------------|
| **Live demo** | ✅ Pregătit | (A se testa direct sau prin deploy) |
| **Minim 2 Agenți AI incluși în funcționalitate** | ✅ Îndeplinit (3 pct) | Agent 1 (Weather Advisor pe hartă), Agent 2 (Smart Vacation Finder). Logica: `lib/agents.ts` și `app/api/vacation/route.ts` |
| **Demo offline (Screencast / YouTube)** | ✅ De adăugat link | (A se adăuga link aici la predare) |
| **Tema unică (Diferită de DAW Sem 1)** | ✅ Îndeplinit | StormTalk (Climatic AI Map & Travel) |

### B. Procesul de dezvoltare software cu AI

| Cerință | Status | Dovadă / Fișier |
|---------|--------|----------------|
| **User stories (minim 10) & backlog creation** | ✅ Îndeplinit (2 pct) | [docs/backlog-refined.md](./docs/backlog-refined.md) (10 User Stories clare) |
| **Diagrame (UML, arhitectura, workflowuri)** | ✅ Îndeplinit (1 pct) | [docs/architecture.md](./docs/architecture.md) |
| **Source control cu git** (Branch, merge, min. 5 commits/student) | ✅ Îndeplinit (1 pct) | Istoricul commiturilor din GitHub (tab-ul *Commits* & *Network*) ilustrează lucrul pe branch-uri pe parcursul lunii. |
| **Teste automate (inclusiv evals agenți)** | ✅ Îndeplinit (2 pct) | [tests/](./tests/) - include `agents.test.ts` și `weather.test.ts` (Vitest) |
| **Raportare bug si rezolvare cu Pull Request** | ✅ Îndeplinit (1 pct) | Raport: [docs/report/bug-report.md](./docs/report/bug-report.md) + PR-ul cu fix-ul din GitHub |
| **Pipeline CI/CD** | ✅ Îndeplinit (1 pct) | [.github/workflows/ci.yml](./.github/workflows/ci.yml) (Rulează testele automat) |
| **Raport folosire tooluri AI in dezvoltare** | ✅ Îndeplinit (2 pct) | [docs/report/ai-usage-report.md](./docs/report/ai-usage-report.md) |

---

## Detalii Tehnice

**Stack-ul Proiectului:**
- Next.js (App Router) + TypeScript + Tailwind CSS
- Open-Meteo (Date meteo gratuite)
- Groq / Gemini API (Modele AI cu Fallback Multi-Provider)
- Supabase (Bază de date PostgreSQL, Autentificare anonimă/email)
- Leaflet + OpenStreetMap (Hărți)

**Cum se rulează local:**
```bash
npm install
npm run dev
```

(Asigurați-vă că aveți fișierul `.env.local` configurat cu cheile aferente).
