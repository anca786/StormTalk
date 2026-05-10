const documents = [
  {
    title: "Plan de proiect",
    description: "Viziune, MVP, arhitectura de baza si extensii.",
    file: "docs/project-plan.md",
  },
  {
    title: "Arhitectura",
    description: "Componentele aplicatiei, API-urile si modelul de date.",
    file: "docs/architecture.md",
  },
  {
    title: "Impartirea taskurilor",
    description: "Responsabilitatile initiale pentru fiecare membru al echipei.",
    file: "docs/team-tasks.md",
  },
  {
    title: "Mapping pe cerinte",
    description: "Legatura dintre cerintele proiectului si artefactele din repo.",
    file: "docs/requirements-mapping.md",
  },
];

export default function DocsPage() {
  return (
    <main className="page-shell">
      <section className="hero-card">
        <p className="eyebrow">Documentatie</p>
        <h1>StormTalk, pregatit si pentru evaluare</h1>
        <p className="lead">
          Pagina centralizeaza documentele cheie ale proiectului si traseaza
          legatura dintre implementare, procesul software si cerintele
          academice.
        </p>
      </section>

      <section className="content-grid">
        {documents.map((document) => (
          <article className="info-card" key={document.title}>
            <h2>{document.title}</h2>
            <p>{document.description}</p>
            <p>Fisier: {document.file}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
