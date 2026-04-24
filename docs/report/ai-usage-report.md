# Raport privind folosirea toolurilor AI în dezvoltare

## Scop
Acest document descrie modul specific în care echipa a utilizat tooluri și modele AI pe parcursul dezvoltării proiectului asistent-ului virtual StormTalk, conform cerințelor academice.

## Tooluri, Modele și API-uri Integrate

Pentru a realiza designul, logica de business și funcționalitățile multi-agent, am folosit următoarele ecosisteme:

### 1. Tooluri de Asistență (IDE / Dezvoltare)
- **Antigravity**: Asistent agentic avansat folosit pentru generarea structurii de cod, arhitectura sistemului, testare Vitest și gestionarea fluxului Git CI/CD.
- **ChatGPT Codex**: Folosit strict pentru iterarea designului de interfață (UI/UX) și obținerea unui aspect modern de "Glassmorphism" folosind CSS Modules.

### 2. Modele Lingvistice (Foundational Models)
Pe parcursul dezvoltării platformei, task-urile de generare a funcționalităților au fost supervizate folosind modelele:
- **Claude Opus 4.6**
- **Gemini 3.1 Pro**
- **ChatGPT 5.4**

### 3. API-uri utilizate DIRECT în Aplicație (Logica Multi-Agent)
Nu am folosit AI doar pentru a scrie cod. Aplicația propriu-zisă depinde de inteligența artificială internă pentru a procesa deciziile meteo:
- **Gemini API**: Motorul principal al agentului *Weather Advisor* și *Vacation Finder*.
- **Groq API (Llama 3.1)**: Motorul de super-viteză acționând pe post de *Fallback logic* în caz că rețeaua vizuală primară cade sau întârzie.

---

## Activități Asistate de AI
- Definirea arhitecturii inițiale (Next.js, Supabase, LLMs).
- Scrierea și rafinarea backlog-ului (User Stories, task-uri).
- Generarea designului de pagină via ChatGPT Codex.
- Crearea logicii de parsare pentru API-ul din Open-Meteo.
- Formulare de "system prompts" pentru personalitățile celor 2 Agenți integrați.
- Configurare teste automate (Vitest).

## Avantaje Observate
- Viteza extremă de iterație a layout-ului grafic.
- Clarificare structurală: modulele de cod generate au fost mai curate datorită agentului Antigravity.
- Implementarea rapidă de logică de fallback fallback intra-agent.

## Limitări Observate
- Unele propuneri de la asistenți au necesitat verificare manuală (precum logica unghiulară a unităților meteo).
- Răspunsurile Agenților API în interiorul aplicației trebuiau aduse la realitate cu un "temperature=0.2" ca să nu prezinte destinații de vacanță inventate sau ilogice.

## Concluzii
Ecosistemul AI a fost utilizat hibrid:
1. **Ca asistent de development** (Modele mari și tooluri pentru scris cod/design).
2. **Ca arhitectură internă funcțională** (Toolurile rulează 2 agenți direct în app prin cheile API).
S-a observat eficiență maximă, fără a înlocui însă verificarea logică și arhitecturală umană.
