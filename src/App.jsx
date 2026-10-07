import { useCallback, useEffect, useState } from "react";
import ShortenForm from "./components/ShortenForm.jsx";
import LinkList from "./components/LinkList.jsx";
import { fetchLinks, shortenUrl, deleteLink } from "./api.js";

export default function App() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadLinks = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setLinks(await fetchLinks());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLinks();
  }, [loadLinks]);

  async function handleShorten(url) {
    const created = await shortenUrl(url);
    await loadLinks(); // the list shows the stored record, including click counts
    return created;
  }

  async function handleDelete(code) {
    try {
      await deleteLink(code);
      setLinks((current) => current.filter((l) => l.code !== code));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="page">
      <header className="hero">
        <h1>Short links that count their clicks</h1>
        <p>
          Share one short link per campaign, message or channel, then see which one
          people actually open. Clicks are counted only when someone uses the short link.
        </p>
      </header>

      <ShortenForm onShorten={handleShorten} />
      <LinkList
        links={links}
        loading={loading}
        error={error}
        onDelete={handleDelete}
        onRefresh={loadLinks}
      />
    </main>
  );
}
