# Arhitectura StormTalk

Acest document prezintă vizual arhitectura sistemului StormTalk, modul de comunicare între componente, fluxul datelor AI și structura bazei de date. Diagramele sunt redate folosind Mermaid (randate automat pe GitHub).

## 1. Arhitectura de Componente (UML Component Diagram)

Această diagramă ilustrează împărțirea logică a aplicației între interfața de utilizator (Frontend), rutele server-side (Backend) și API-urile externe.

```mermaid
graph TD
    %% Frontend Components
    subgraph Frontend ["Next.js Client Components"]
        Map["Harta Interactiva Leaflet"]
        Vacation["Smart Vacation Finder"]
        Profile["Profil & Autentificare"]
        History["Panou Istoric"]
    end

    %% Backend API Routes
    subgraph Backend ["Next.js API Routes"]
        API_Weather["API Vreme (Weather)"]
        API_Debate["API Agenti Vreme (Debate)"]
        API_Vacation["API Agenti Vacanta (Vacation)"]
        API_DB["API Baza de Date (DB)"]
    end

    %% External Services
    subgraph External ["Servicii Externe"]
        OpenMeteo(("Open-Meteo API"))
        Gemini(("Gemini / Groq AI"))
        Supabase[("Supabase PostgreSQL")]
    end

    %% Connections
    Map <--> API_Weather
    Map <--> API_Debate
    Vacation <--> API_Vacation
    History <--> API_DB
    Profile <--> API_DB

    API_Weather --> OpenMeteo
    API_Debate --> Gemini
    API_Vacation --> Gemini
    API_DB <--> Supabase
```

## 2. Fluxul de Execuție AI (Sequence Diagram)

Diagrama de mai jos prezintă fluxul pas-cu-pas care se întâmplă atunci când un utilizator selectează o locație pentru analiza vremii sau pentru planificarea vacanței:

```mermaid
sequenceDiagram
    actor User
    participant Client as Frontend
    participant API as Rute Backend
    participant ExtMeteo as Open-Meteo
    participant ExtLLM as Gemini/Groq
    participant DB as Supabase

    User->>Client: Selecteaza o cerere (Vreme / Vacanta)
    
    alt Este o cerere de Vreme pe Harta
        Client->>API: GET Date Meteo (Coordonate)
        API->>ExtMeteo: Fetch real-time weather
        ExtMeteo-->>API: Parametri meteo bruti
        API-->>Client: Returneaza date meteo
    end
    
    Client->>API: Cere analiza AI (Debate / Vacation)
    API->>ExtLLM: Trimite parametrii + Prompt Agent
    ExtLLM-->>API: Răspuns inteligent (Fallback automat la Groq in caz de eroare)
    API-->>Client: Mesaj formatat cu sugestii

    Client-->>User: Afișare UI
    
    Client->>DB: Salvare automata in History
    DB-->>Client: Confirmare salvare
```

## 3. Schema Bazei de Date (Entity-Relationship Diagram)

Baza de date relațională este găzduită pe Supabase și gestionează utilizatorii, setările acestora, istoricul conversațiilor AI și destinațiile favorite.

```mermaid
erDiagram
    USERS ||--o| PROFILES : "are"
    USERS ||--o{ FAVORITES : "salveaza"
    USERS ||--o{ HISTORY : "genereaza"

    USERS {
        uuid id PK
        string email
        string encrypted_password
    }

    PROFILES {
        uuid user_id PK
        string display_name
        string preferred_unit
    }

    FAVORITES {
        uuid id PK
        uuid user_id FK
        float latitude
        float longitude
        string label
        timestamp created_at
    }

    HISTORY {
        uuid id PK
        uuid user_id FK
        float latitude
        float longitude
        jsonb weather_payload
        jsonb ai_conversation
        timestamp created_at
    }
```
