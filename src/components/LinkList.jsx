export default function LinkList({ links, loading, error, onDelete, onRefresh }) {
  const maxClicks = Math.max(1, ...links.map((l) => l.clicks));

  return (
    <section className="panel" aria-labelledby="links-heading">
      <div className="panel-head">
        <h2 id="links-heading">Your links</h2>
        <button type="button" className="secondary" onClick={onRefresh} disabled={loading}>
          {loading ? "Refreshing…" : "Refresh clicks"}
        </button>
      </div>

      {error && <p role="alert" className="error">{error}</p>}

      {!error && !loading && links.length === 0 && (
        <p className="empty">No links yet. Shorten your first link above.</p>
      )}

      <ul className="links">
        {links.map((link) => (
          <li key={link.code} className="link-row">
            <div className="link-main">
              <a href={link.shortUrl} target="_blank" rel="noreferrer" className="short">
                {link.shortUrl}
              </a>
              <span className="original" title={link.originalUrl}>{link.originalUrl}</span>
            </div>

            <div className="clicks" aria-label={`${link.clicks} clicks`}>
              <span className="count">{link.clicks}</span>
              <span className="unit">{link.clicks === 1 ? "click" : "clicks"}</span>
              <span className="bar" aria-hidden="true">
                <span style={{ width: `${(link.clicks / maxClicks) * 100}%` }} />
              </span>
            </div>

            <button
              type="button"
              className="danger"
              onClick={() => {
                if (window.confirm("Delete this link? The short URL will stop working.")) {
                  onDelete(link.code);
                }
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
