# StormTalk

StormTalk is an advanced, multi-agent Web Application that integrates real-time meteorological data obtained via API with an intelligent LLM architecture. It orchestrates two distinct virtual agents that process climate parameters to dynamically generate contextual analysis, clothing advice, and vacation destination recommendations.

## Team Members
- Staicu Octavian Stefan
- Tanasoiu Maria Alexia
- Bizon Anca Elena

## AI Agents Architecture

The core functionality of StormTalk relies on two tailored AI Agents, each built with specific persona prompts and fallback logic (Gemini API with Groq Llama 3.1 fallback):

### 1. The Weather Advisor 
This agent analyzes real-time weather parameters (temperature, wind, precipitation) for any geographical coordinate selected on the map.
- **Goal:** Act as an entertainer and meteorologist.
- **Capabilities:** Analyzes current weather conditions and generates context-aware, practical advice (e.g., what clothes to wear, whether it's safe to hike, or if you should stay indoors).

### 2. The Vacation Finder 
This agent processes natural language descriptions of a user's dream vacation.
- **Goal:** Suggest actual global destinations that match the user's preferred weather conditions.
- **Capabilities:** Takes user constraints (e.g., "I want a cool, crisp mountain city under 20 degrees Celsius") and dynamically finds matching coordinates, validating them against the current live weather forecasts before making a polished recommendation.

## Full Product Backlog (User Stories)

### EPIC 1: Live Map & Weather Discovery
- **User Story 1.1:** As a user, I want to explore an interactive global map so that I can visually locate interesting weather events worldwide.
- **User Story 1.2:** As a user, I want to drop a pin anywhere on the map so that I can instantly see the current weather conditions for that exact location.

### EPIC 2: The Agentic Advisor
- **User Story 2.1:** As a user, I want an AI Meteorologist to explain the weather, so that I can understand the scientific data in a friendly manner.
- **User Story 2.2:** As a user, I want the AI commentary to give me specific clothing and activity advice based on actual real-time conditions.

### EPIC 3: Smart Vacation Finder
- **User Story 3.1:** As a traveler, I want to describe my ideal vacation weather, so the AI suggests matching global destinations.
- **User Story 3.2:** As a traveler, I want the AI agent to give me the forecast for its suggested location, so I get practical travel advice before packing my bags.

### EPIC 4: Personalization, History & Favorites
- **User Story 4.1:** As a user, I want to securely log in to my account so my data is kept private.
- **User Story 4.2:** As a user, I want to save interesting locations to a "Favorites" list so I can track their weather changes.
- **User Story 4.3:** As a user, I want to view my past AI weather consultations in a chronological history.
- **User Story 4.4:** As a user, I want to toggle between Celsius and Fahrenheit in my preferences.

## Tech Stack & CI/CD
- **Frontend Framework:** Next.js (React) + TypeScript
- **Styling:** CSS Modules / Glassmorphism UI
- **Database & Auth:** Supabase (PostgreSQL + RLS)
- **Map:** Leaflet.js
- **Testing:** Vitest (Unit Tests for logic and Prompts)
- **APIs:** Open-Meteo API, Gemini API, Groq Cloud API
- **Deployment & CI:** GitHub Actions (for automated lint/tests) & Vercel (Production Hosting)

