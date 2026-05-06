const features = [
  "Harta interactiva cu selectare prin coordonate",
  "Date meteo actuale prin Open-Meteo",
  "Weather Advisor pentru recomandari meteo",
  "Vacation Finder pentru destinatii potrivite",
  "Autentificare securizata, favorite si istoric",
];

export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="hero-card">
        <p className="eyebrow">StormTalk</p>
        <h1>Vreme reala, explicata de doi agenti AI</h1>
        <p className="lead">
          Proiect academic care combina harta interactiva, date meteo live si o
          analiza generata de doi agenti AI: unul pentru vreme si unul pentru vacante.
        </p>

        <div className="cta-row">
          <a className="primary-link" href="/map">
            Deschide harta
          </a>
          <a className="secondary-link" href="/docs">
            Vezi documentatia
          </a>
        </div>
      </section>

      <section className="content-grid">
        <article className="info-card">
          <h2>Ce construim</h2>
          <ul>
            {features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </article>

        <article className="info-card">
          <h2>Cei doi agenti</h2>
          <p>
            Weather Advisor explica datele meteo si recomanda actiuni practice,
            iar Vacation Finder propune destinatii pe baza preferintelor meteo
            ale utilizatorului.
          </p>
        </article>
      </section>
    </main>
  );
}
