import { useState } from "react";

function isValidHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export default function ShortenForm({ onShorten }) {
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const value = url.trim();
    setError("");
    setResult(null);

    if (!isValidHttpUrl(value)) {
      setError("Enter a full link that starts with http:// or https://");
      return;
    }

    setBusy(true);
    try {
      const created = await onShorten(value);
      setResult(created);
      setUrl("");
      setCopied(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function copy() {
    await navigator.clipboard.writeText(result.shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <section className="panel" aria-labelledby="shorten-heading">
      <h2 id="shorten-heading">Shorten a link</h2>
      <form onSubmit={handleSubmit} className="shorten-form" noValidate>
        <label htmlFor="url" className="sr-only">Link to shorten</label>
        <input
          id="url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/a-very-long-product-page"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "url-error" : undefined}
          autoComplete="off"
        />
        <button type="submit" disabled={busy}>
          {busy ? "Shortening…" : "Shorten link"}
        </button>
      </form>

      {error && (
        <p id="url-error" role="alert" className="error">{error}</p>
      )}

      {result && (
        <div className="result" role="status">
          <a href={result.shortUrl} target="_blank" rel="noreferrer">{result.shortUrl}</a>
          <button type="button" className="secondary" onClick={copy}>
            {copied ? "Copied" : "Copy link"}
          </button>
        </div>
      )}
    </section>
  );
}
