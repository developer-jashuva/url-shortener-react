const API = (import.meta.env.VITE_API_URL || "http://localhost:5158").replace(/\/$/, "");

async function request(path, options = {}) {
  let res;

  const token = localStorage.getItem("token");

  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...options.headers,
  };

  // Attach JWT when available
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    res = await fetch(`${API}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error("Can't reach the server. Check that the API is running.");
  }

  if (!res.ok) {

    if (res.status === 401) {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("auth:logout"));
    throw new Error("Your session has expired. Please log in again.");
  }

    let message = `Request failed (${res.status})`;

    try {
      const body = await res.json();
      message = body.message || body.error || body.title || message;
    } catch {
      // Response had no JSON body
    }

    throw new Error(message);
  }



  if (res.status === 204) return null;

  const text = await res.text();

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

// The API may name fields slightly differently; map them to one shape for the UI.
// If your Swagger shows different names, change them here only.
export function normalize(item) {
  if (typeof item === "string") {
    const code = item.split("/").filter(Boolean).pop();
    return {
      code,
      originalUrl: "",
      shortUrl: item.startsWith("http") ? item : `${API}/${code}`,
      clicks: 0,
      createdAt: null,
    };
  }
  const code = item.shortCode ?? item.code;
  return {
    code,
    originalUrl: item.originalUrl ?? item.longUrl ?? "",
    shortUrl: item.shortUrl ?? `${API}/${code}`,
    clicks: item.clickCount ?? item.clicks ?? 0,
    createdAt: item.createdAt ?? item.createdOn ?? null,
  };
}

export async function shortenUrl(originalUrl) {
  const data = await request("/api/url/shorten", {
    method: "POST",
    body: JSON.stringify({ originalUrl }),
  });
  return normalize(data);
}

export async function fetchLinks() {
  const data = await request("/api/url/all");
  const list = Array.isArray(data) ? data : data?.items ?? [];
  return list.map(normalize);
}

export function deleteLink(code) {
  return request(`/api/url/${encodeURIComponent(code)}`, { method: "DELETE" });
}

export async function fetchAnalytics() {
  return request("/api/url/analytics");
}
