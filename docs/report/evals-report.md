# Raport Evaluare Agenți AI (Evals) — StormTalk

Acest document descrie procesul de evaluare automată (evals) al agenților AI integrați în aplicația StormTalk, utilizând framework-ul open-source **Promptfoo**.

Configurarea completă se găsește în fișierul [`promptfooconfig.yaml`](../promptfooconfig.yaml) din rădăcina proiectului.

---

## 1. De ce sunt necesare Evals?

Agenții AI pot genera răspunsuri imprevizibile (halucinări, format greșit, limbă greșită). Evaluările automate ne permit să:
- Verificăm **calitatea** și **consistența** răspunsurilor
- Detectăm **regresii** când schimbăm prompt-urile
- Validăm că AI-ul respectă **formatarea cerută** (JSON, limba română etc.)
- Măsurăm performanța pe mai multe scenarii simultan

## 2. Tool utilizat: Promptfoo

Am ales [Promptfoo](https://promptfoo.dev/) deoarece:
- Este open-source și gratuit
- Suportă multiple provideri (Gemini, Groq, OpenAI etc.)
- Permite definirea de aserțiuni clare (contains, is-json, custom JS)
- Se integrează ușor cu pipeline-ul CI/CD existent

### Rulare locală:
```bash
npm run eval
```

## 3. Agenți evaluați

### Agent 1: Weather Advisor
- **Rol**: Analizează datele meteo reale și oferă recomandări practice de îmbrăcăminte
- **Fișier sursă**: `lib/agents.ts` → funcția `buildWeatherAdvisorPrompt()`
- **Provider AI**: Gemini 2.0 Flash (cu fallback pe Groq Llama 3.1)

### Agent 2: Vacation Finder
- **Rol**: Sugerează destinații de vacanță bazate pe preferințele meteo ale utilizatorului
- **Fișier sursă**: `lib/agents.ts` → funcția `buildVacationFinderPrompt()`
- **Provider AI**: Gemini 2.0 Flash (cu fallback pe Groq Llama 3.1)

## 4. Scenarii de testare (Test Cases)

### 4.1 Weather Advisor — Vreme rece cu ploaie

| Aserțiune | Tip | Rezultat |
|-----------|-----|----------|
| Răspunsul conține "geacă" | `icontains` | ✅ PASS |
| Răspunsul conține "umbrelă" | `icontains` | ✅ PASS |
| Răspunsul NU este JSON (e text natural) | `is-json: false` | ✅ PASS |
| Lungime sub 500 caractere (concis) | `javascript` | ✅ PASS |

**Observații**: Agentul Weather Advisor răspunde corect în limba română, menționează haine groase și umbrelă pentru vreme rece cu ploaie. Tonul este prietenos și practic.

### 4.2 Vacation Finder — Cerere de schi

| Aserțiune | Tip | Rezultat |
|-----------|-----|----------|
| Răspunsul este JSON valid | `is-json` | ✅ PASS |
| JSON-ul conține câmpul `city` | `javascript` | ✅ PASS |

**Observații**: Agentul Vacation Finder returnează JSON valid cu destinații reale de schi (ex: Innsbruck, Chamonix). Coordonatele sunt reale și precise.

## 5. Rezultate agregate

```
┌──────────────────────────────────────────────┬──────────┐
│ Test Case                                    │ Status   │
├──────────────────────────────────────────────┼──────────┤
│ Weather Advisor - Vreme Rece si Ploaie       │ ✅ PASS  │
│ Vacation Finder - JSON Output (Schi)         │ ✅ PASS  │
├──────────────────────────────────────────────┼──────────┤
│ Total                                        │ 2/2 PASS │
└──────────────────────────────────────────────┴──────────┘
```

**Rată de succes: 100%** (2 din 2 scenarii evaluate cu succes)

## 6. Probleme identificate și rezolvate

| Problemă | Soluție |
|----------|---------|
| Gemini ocazional nu răspundea în română | Am adăugat instrucțiunea explicită "Raspunzi doar in limba romana" în prompt |
| Vacation Finder returna uneori text în loc de JSON | Am adăugat regula "Raspunde STRICT in format JSON, fara markdown" |
| Fallback-ul la Groq genera răspunsuri mai scurte | Am acceptat acest comportament — calitatea rămâne suficientă |

## 7. Concluzie

Evaluările automate cu Promptfoo ne-au permis să validăm că ambii agenți AI din StormTalk funcționează corect și consistent. Configurarea este reproductibilă și poate fi rulată oricând prin comanda `npm run eval`.
