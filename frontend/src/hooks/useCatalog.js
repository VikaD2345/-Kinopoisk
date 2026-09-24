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

const normalizeItem = (item, apiUrl, type) => ({
  ...item,
  id: String(item.id),
  type,
  original: item.original || item.title,
  rating: item.rating ?? null,
  age: item.age || "",
  duration: item.duration || "",
  genres: Array.isArray(item.genres) ? item.genres : [],
  director: item.director || "Не указан",
  poster: mediaUrl(
    item.poster ?? item.posterUrl ?? item.poster_url ?? item.image,
    apiUrl,
  ),
  backdrop: mediaUrl(
    item.backdrop ?? item.backdropUrl ?? item.backdrop_url ?? item.image,
    apiUrl,
  ),
});

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
        const requestOptions = {
          signal: controller.signal,
          headers: { Accept: "application/json" },
        };
        const baseUrl = apiUrl.replace(/\/$/, "");
        const [moviesResponse, seriesResponse] = await Promise.all([
          fetch(`${baseUrl}/movies`, requestOptions),
          fetch(`${baseUrl}/series`, requestOptions),
        ]);

        if (!moviesResponse.ok) {
          throw new Error(`HTTP movies=${moviesResponse.status}`);
        }

        const remoteMovies = toArray(await moviesResponse.json()).map((item) =>
          normalizeItem(item, apiUrl, "movie"),
        );
        const remoteSeries = seriesResponse.ok
          ? toArray(await seriesResponse.json()).map((item) =>
              normalizeItem(item, apiUrl, "series"),
            )
          : initialCatalog.filter((item) => item.type === "series");
        const normalized = [...remoteMovies, ...remoteSeries];

        setItems(normalized);
        setStatus(seriesResponse.ok ? "ready" : "partial");
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
