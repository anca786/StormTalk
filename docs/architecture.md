# Arhitectura StormTalk

Acest document prezintă vizual arhitectura sistemului StormTalk, modul de comunicare între componente, fluxul datelor AI și structura bazei de date. Diagramele sunt redate folosind Mermaid (randate automat pe GitHub).

## 1. Arhitectura de Componente (UML Component Diagram)

Această diagramă ilustrează împărțirea logică a aplicației între interfața de utilizator (Frontend), rutele server-side (Backend) și API-urile externe.

```mermaid
graph TD
    %% Frontend Components
    subgraph Frontend [Next.js Client Components]
        Map[Harta Interactiva Leaflet]
        Vacation[Smart Vacation Finder]
        Profile[Profil & Autentificare]
        History[Panou Istoric]
    end

    %% Backend API Routes
    subgraph Backend [Next.js API Routes]
        API_Weather[/api/weather/]
        API_Debate[/api/debate/]
        API_Vacation[/api/vacation/]
        API_DB[/api/history & /api/favorites]
    end

    %% External Services
    subgraph External [Servicii Externe]
        OpenMeteo((Open-Meteo API))
        Gemini((Gemini / Groq AI))
        Supabase[(Supabase PostgreSQL)]
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

Diagrama de mai jos prezintă fluxul pas-cu-pas care se întâmplă atunci când un utilizator selectează un punct pe hartă: de la obținerea coordonatelor, extragerea datelor meteo, până la dezbaterea generată de agenții AI.

```mermaid
sequenceDiagram
    actor User
    participant Client as Frontend (Map)
    participant Weather as API /weather
    participant AI as API /debate
    participant ExtMeteo as Open-Meteo
    participant ExtLLM as Gemini/Groq
    participant DB as Supabase

    User->>Client: Click pe coordonate (Lat, Lng)
    Client->>Weather: GET /api/weather?lat=...&lng=...
    Weather->>ExtMeteo: Fetch real-time weather
    ExtMeteo-->>Weather: Return temperature, wind, etc.
    Weather-->>Client: Date meteo brute
    
    Client->>AI: POST /api/debate (Weather Payload)
    AI->>ExtLLM: Prompt complex (Agent 1 + Agent 2)
    ExtLLM-->>AI: Răspuns dezbatere (Meteorolog vs Localnic)
    AI-->>Client: Mesaj formatat

    Client-->>User: Afișare UI (Date + Chat AI)
    
    Client->>DB: POST /api/history (Salvare conversație)
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
        uuid user_id PK, FK
        string display_name
        string preferred_unit "celsius/fahrenheit"
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
