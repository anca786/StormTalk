# StormTalk ⛈️

StormTalk este o aplicatie web care integreaza date meteorologice obtinute in timp real cu o arhitectura AI multi-agent. Aplicatia orchestreaza agenti virtuali care analizeaza parametrii climatici si genereaza contextual analize meteo pentru orice coordonate geografice selectate pe harta, alaturi de functionalitati de planificare a vacantelor in functie de clima.

## Grila de Evaluare & Dovezi Implementare

Acest fișier acționează ca un index rapid pentru a facilita verificarea tuturor cerințelor proiectului, direct pe codul existent:

### A. Implementarea

| Cerință | Dovadă / Fișier |
|---------|----------------|
| **Minim 2 Agenți AI incluși în funcționalitate** | Agent 1 (Weather Advisor pe hartă), Agent 2 (Smart Vacation Finder). Logica de orchestrare: [lib/agents.ts](./lib/agents.ts) și [app/api/vacation/route.ts](./app/api/vacation/route.ts) |

### B. Procesul de dezvoltare software cu AI

| Cerință | Dovadă / Fișier |
|---------|----------------|
| **User stories (minim 10) & backlog creation** | [docs/backlog-refined.md](./docs/backlog-refined.md) (10 User Stories clare sub formă Agile) |
| **Diagrame (UML, arhitectura, workflowuri)** | [docs/architecture.md](./docs/architecture.md) (Diagrame de Componente, Secvență și ERD vizuale) |
| **Source control cu git** | Istoricul complet poate fi vizualizat în tab-ul *Commits*. Conține distribuția pe membri. |
| **Teste automate (inclusiv evals agenți)** | Teste unitare: [tests/](./tests/) (Vitest). Evaluări AI (Promptfoo): [docs/report/evals-report.md](./docs/report/evals-report.md) + config: [promptfooconfig.yaml](./promptfooconfig.yaml) |
| **Raportare bug si rezolvare cu Pull Request** | Raport text detaliat: [docs/report/bug-report.md](./docs/report/bug-report.md) (Asociat PR-ului generat) |
| **Pipeline CI/CD** | [.github/workflows/ci.yml](./.github/workflows/ci.yml) (Verificare și automatizare teste) |
| **Raport folosire tooluri AI in dezvoltare** | [docs/report/ai-usage-report.md](./docs/report/ai-usage-report.md) |

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
