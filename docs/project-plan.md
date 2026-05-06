# Plan de proiect StormTalk

## Viziune

StormTalk transforma datele meteo brute in explicatii accesibile si recomandari de calatorie prin doi agenti AI:

- Weather Advisor: explica vremea curenta si recomanda actiuni practice
- Vacation Finder: sugereaza destinatii pe baza preferintelor meteo si a prognozei

## Arhitectura propusa

1. Utilizatorul selecteaza o locatie pe harta.
2. Aplicatia cere vremea actuala din Open-Meteo pe baza coordonatelor.
3. Serverul normalizeaza datele relevante.
4. Weather Advisor primeste contextul meteo si genereaza analiza pentru harta.
5. Vacation Finder primeste preferintele utilizatorului si genereaza destinatii.
6. Analizele meteo pot fi salvate in istoric si legate de favorite.

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
