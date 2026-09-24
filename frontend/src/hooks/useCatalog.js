import { useEffect, useState } from "react";

const toArray = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.items)) return payload.items;
  return [...(payload?.movies || []), ...(payload?.series || [])];
};

const mediaUrl = (value, apiUrl) => {
  if (!value) return null;
  try {
    return new URL(value, `${apiUrl.replace(/\/$/, "")}/`).href;
  } catch {
    return value;
  }
};

export function useCatalog(initialCatalog, apiUrl) {
  const [items, setItems] = useState(initialCatalog);
  const [status, setStatus] = useState(apiUrl ? "loading" : "local");

  useEffect(() => {
    if (!apiUrl) {
      return;
    }

    const controller = new AbortController();

    async function loadCatalog() {
      try {
        setStatus("loading");
        const response = await fetch(`${apiUrl.replace(/\/$/, "")}/catalog`, {
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const remoteItems = toArray(await response.json());
        const localById = new Map(
          initialCatalog.map((item) => [String(item.id), item]),
        );
        const normalized = remoteItems.map((item) => ({
          ...localById.get(String(item.id)),
          ...item,
          id: String(item.id),
          poster: mediaUrl(
            item.poster ?? item.posterUrl ?? item.poster_url,
            apiUrl,
          ),
          backdrop: mediaUrl(
            item.backdrop ?? item.backdropUrl ?? item.backdrop_url,
            apiUrl,
          ),
        }));

        setItems(normalized);
        setStatus("ready");
      } catch (error) {
        if (error.name !== "AbortError") {
          console.warn(
            "Backend каталога недоступен, показаны плейсхолдеры:",
            error,
          );
          setItems(initialCatalog);
          setStatus("error");
        }
      }
    }

    loadCatalog();
    return () => controller.abort();
  }, [apiUrl, initialCatalog]);

  return { items, status };
}
