import { useCallback, useEffect, useState } from "react";
import ShortenForm from "./components/ShortenForm.jsx";
import LinkList from "./components/LinkList.jsx";
import { fetchLinks, shortenUrl, deleteLink, fetchAnalytics } from "./api.js";
import Login from "./components/Login";
import Register from "./components/Register";


export default function App() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [authPage, setAuthPage] = useState("login");

  const [currentUser, setCurrentUser] = useState(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    return null;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    if (payload.exp * 1000 <= Date.now()) {
      localStorage.removeItem("token");
      return null;
    }

    return {
      id: payload.nameid || payload.sub,
      username: payload.unique_name,
      email: payload.email,
    };
  } catch {
    localStorage.removeItem("token");
    return null;
  }
});


const [analytics, setAnalytics] = useState({
  totalUrls: 0,
  totalClicks: 0,
  activeUrls: 0,
});

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

  const loadAnalytics = useCallback(async () => {
  try {
    const data = await fetchAnalytics();
    setAnalytics(data);
  } catch (err) {
    setError(err.message);
  }
}, []);




  useEffect(() => {
    loadLinks();
  }, [loadLinks]);

  useEffect(() => {
  function handleAuthLogout() {
    setCurrentUser(null);
    setAuthPage("login");
  }

  window.addEventListener("auth:logout", handleAuthLogout);

  return () => {
    window.removeEventListener("auth:logout", handleAuthLogout);
  };
}, []);

useEffect(() => {
  loadAnalytics();
}, [loadAnalytics]);


  async function handleShorten(url) {
    const created = await shortenUrl(url);
    await loadLinks(); // the list shows the stored record, including click counts
    await Promise.all([loadLinks(), loadAnalytics()]);
    return created;
  }

  async function handleDelete(code) {
    try {
      await deleteLink(code);
      setLinks((current) => current.filter((l) => l.code !== code));
      await loadAnalytics();
    } catch (err) {
      setError(err.message);
    }
  }

  function handleLogin(data) {
  localStorage.setItem("token", data.token);
  setCurrentUser(data.user);
}

if (!currentUser) {
  if (authPage === "register") {
    return (
      <Register
        onSwitchToLogin={() => setAuthPage("login")}
      />
    );
  }

  return (
    <Login
      onLogin={handleLogin}
      onSwitchToRegister={() => setAuthPage("register")}
    />
  );
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

      <section className="analytics">
  <div className="analytics-card">
    <h3>Total URLs</h3>
    <p>{analytics.totalUrls}</p>
  </div>

  <div className="analytics-card">
    <h3>Total Clicks</h3>
    <p>{analytics.totalClicks}</p>
  </div>

  <div className="analytics-card">
    <h3>Active URLs</h3>
    <p>{analytics.activeUrls}</p>
  </div>
</section>

      <ShortenForm onShorten={handleShorten} />
      <LinkList
        links={links}
        loading={loading}
        error={error}
        onDelete={handleDelete}
        onRefresh={loadLinks}
      />

      <button
  onClick={() => {
    localStorage.removeItem("token");
    setCurrentUser(null);
    setAuthPage("login");
  }}
>
  Logout
</button>

    </main>
  );
}
