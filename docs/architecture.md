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
- Gemini API pentru generarea dezbaterii
- Supabase pentru stocarea datelor utilizatorului

## Agenti AI

### Meteorologul

- stil tehnic
- explica temperaturi, vant, precipitatii, presiune, umiditate
- mentioneaza eventuale riscuri

### Localnicul

- stil colocvial
- traduce vremea in experienta umana
- da recomandari practice si de context local

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
