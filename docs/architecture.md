# Arhitectura StormTalk

## Componente principale

### Frontend

- Pagina Home
- Pagina Harta
- Pagina Vacation Finder
- Pagina Favorites
- Pagina History
- Pagina Login / Register
- Pagina Profile

### Backend logic

- `GET /api/weather`
- `POST /api/debate`
- `GET /api/favorites`
- `POST /api/favorites`
- `GET /api/history`

### Integrari externe

- Open-Meteo pentru date meteo
- Gemini API / Groq API pentru generarea raspunsurilor agentilor
- Supabase pentru stocarea datelor utilizatorului

## Agenti AI

### Weather Advisor

- explica vremea curenta pe baza datelor Open-Meteo
- recomanda imbracaminte, accesorii si activitati potrivite
- are fallback local daca providerii AI nu raspund

### Vacation Finder

- sugereaza destinatii pe baza preferintelor meteo ale utilizatorului
- cere raspuns JSON pentru destinatii si coordonate
- foloseste prognoza reala pentru rezumatul fiecarei destinatii

## Persistenta datelor

### `profiles`

- user_id
- display_name
- preferred_unit

### `favorites`

- id
- user_id
- latitude
- longitude
- label
- created_at

### `history`

- id
- user_id
- latitude
- longitude
- weather_payload
- ai_conversation
- created_at
