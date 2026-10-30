export default function ClickChart({ links }) {
  if (!links || links.length === 0) {
    return (
      <section className="click-chart">
        <h2>Clicks per URL</h2>
        <p>No URL data available yet.</p>
      </section>
    );
  }

  const maxClicks = Math.max(...links.map((link) => link.clicks), 1);

  return (
    <section className="click-chart">
      <h2>Clicks per URL</h2>

      <div className="chart-bars">
        {links.map((link) => (
          <div className="chart-item" key={link.code}>
            <div className="bar-value">{link.clicks}</div>

            <div className="bar-container">
              <div
                className="bar"
                style={{
                  height: `${(link.clicks / maxClicks) * 100}%`,
                }}
              />
            </div>

            <div className="bar-label">{link.code}</div>
          </div>
        ))}
      </div>
    </section>
  );
}