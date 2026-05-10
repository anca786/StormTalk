# Plan de proiect StormTalk

## Viziune

StormTalk transforma datele meteo brute in explicatii accesibile si interactive prin colaborarea dintre doi agenti AI:

- Meteorologul: analizeaza stiintific datele
- Localnicul: interpreteaza impactul practic si uman

## Arhitectura propusa

1. Utilizatorul selecteaza o locatie pe harta.
2. Aplicatia cere vremea actuala din Open-Meteo pe baza coordonatelor.
3. Serverul normalizeaza datele relevante.
4. Cei doi agenti primesc acelasi context meteo, dar prompturi diferite.
5. Raspunsurile sunt afisate sub forma de dezbatere.
6. Conversatia poate fi salvata in istoric si legata de favorite.

## MVP

- Harta interactiva
- Selectie locatie
- Date meteo in timp real
- Doi agenti AI
- Cont utilizator
- Favorite
- Istoric

## Extensii

- Smart Vacation Finder
- Cautare dupa oras
- Filtre avansate
- Dashboard pentru preferinte
