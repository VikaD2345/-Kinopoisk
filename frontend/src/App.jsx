import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Bell,
  Bookmark,
  Check,
  ChevronRight,
  Info,
  Play,
  Star,
} from "lucide-react";
import MovieCard from "./components/MovieCard/MovieCard";
import SearchBar from "./components/SearchBar/SearchBar";
import Sidebar from "./components/Sidebar/Sidebar";
import { catalog as localCatalog } from "./data/catalog";
import { useCatalog } from "./hooks/useCatalog";
import "./App.css";
import "./HeroFix.css";
import "./BackendReady.css";

const pageInfo = {
  movies: ["Фильмы", "Истории, к которым хочется возвращаться"],
  series: ["Сериалы", "Миры, в которых можно остаться надолго"],
  new: ["Новинки", "Самое свежее в нашей коллекции"],
  "my-list": ["Мой список", "Всё, что вы отложили на потом"],
};

function App({
  initialCatalog = localCatalog,
  apiUrl = import.meta.env.VITE_API_URL,
}) {
  const parseHash = () => {
    const value = location.hash.slice(1);
    return value.startsWith("title/")
      ? { route: "detail", id: value.split("/")[1] }
      : { route: value || "home" };
  };
  const [view, setView] = useState(parseHash);
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("vams-list")) || [];
    } catch {
      return [];
    }
  });
  const { items: catalog, status: catalogStatus } = useCatalog(
    initialCatalog,
    apiUrl,
  );
  const movies = useMemo(
    () => catalog.filter((item) => item.type === "movie"),
    [catalog],
  );
  const series = useMemo(
    () => catalog.filter((item) => item.type === "series"),
    [catalog],
  );
  const featured = movies[0];
  useEffect(() => {
    const change = () => {
      setView(parseHash());
      scrollTo({ top: 0, behavior: "smooth" });
    };
    addEventListener("hashchange", change);
    return () => removeEventListener("hashchange", change);
  }, []);
  useEffect(
    () => localStorage.setItem("vams-list", JSON.stringify(saved)),
    [saved],
  );
  const navigate = (route) => {
    setQuery("");
    location.hash = route === "home" ? "" : route;
  };
  const open = (item) => navigate(`title/${item.id}`);
  const toggle = (id) =>
    setSaved((current) =>
      current.includes(id) ? current.filter((x) => x !== id) : [...current, id],
    );
  const filtered = useMemo(
    () =>
      query.trim()
        ? catalog.filter((x) =>
            `${x.title} ${x.original} ${(x.genres || []).join(" ")}`
              .toLowerCase()
              .includes(query.toLowerCase()),
          )
        : [],
    [query, catalog],
  );
  const detail =
    view.route === "detail" ? catalog.find((x) => x.id === view.id) : null;
  return (
    <div className="app">
      <Sidebar
        route={
          view.route === "detail"
            ? detail?.type === "series"
              ? "series"
              : "movies"
            : view.route
        }
        onNavigate={navigate}
      />
      <main className="main">
        <header className="topbar">
          <SearchBar value={query} onChange={setQuery} />
          <div className="topbar__profile">
            <button aria-label="Уведомления">
              <Bell />
            </button>
            <span>M</span>
          </div>
        </header>
        {catalogStatus === "loading" && (
          <div className="api-status">Загрузка каталога…</div>
        )}
        {query ? (
          <SearchResults
            items={filtered}
            saved={saved}
            onOpen={open}
            onToggle={toggle}
            query={query}
          />
        ) : detail ? (
          <Detail
            item={detail}
            saved={saved.includes(detail.id)}
            onBack={() =>
              navigate(detail.type === "series" ? "series" : "movies")
            }
            onToggle={() => toggle(detail.id)}
          />
        ) : view.route === "home" ? (
          <Home
            featured={featured}
            movies={movies}
            series={series}
            saved={saved}
            onOpen={open}
            onToggle={toggle}
            onNavigate={navigate}
          />
        ) : (
          <CatalogPage
            catalog={catalog}
            movies={movies}
            series={series}
            route={view.route}
            saved={saved}
            onOpen={open}
            onToggle={toggle}
          />
        )}
      </main>
    </div>
  );
}

function Home({
  featured,
  movies,
  series,
  saved,
  onOpen,
  onToggle,
  onNavigate,
}) {
  if (!featured)
    return (
      <div className="empty">
        <h2>Каталог пуст</h2>
        <p>Ожидаются данные от backend.</p>
      </div>
    );
  return (
    <div className="page page--home">
      <section
        className={`hero ${featured.backdrop ? "" : "hero--placeholder"}`}
        style={
          featured.backdrop
            ? { "--hero": `url(${featured.backdrop})` }
            : undefined
        }
      >
        {!featured.backdrop && (
          <div className="hero__media-placeholder">
            <span>BACKDROP</span>
          </div>
        )}
        <div className="hero__grain" />
        <div className="hero__content">
          <p className="eyebrow">VAMS ORIGINAL · ВЫБОР РЕДАКЦИИ</p>
          <h1>
            Дюна<span>Часть вторая</span>
          </h1>
          <div className="hero__meta">
            <b>★ {featured.rating}</b>
            <span>{featured.year}</span>
            <span>{featured.age}</span>
            <span>{featured.duration}</span>
          </div>
          <p>{featured.description}</p>
          <div className="hero__actions">
            <button
              className="button button--light"
              onClick={() => onOpen(featured)}
            >
              <Play fill="currentColor" />
              Смотреть
            </button>
            <button
              className="button button--glass"
              onClick={() => onOpen(featured)}
            >
              <Info />
              Подробнее
            </button>
          </div>
        </div>
        <div className="hero__index">
          <i />
          01 <span>/ 05</span>
        </div>
      </section>
      <section className="content-section">
        <Title
          title="Популярное сейчас"
          action="Все фильмы"
          onAction={() => onNavigate("movies")}
        />
        <Grid items={movies.slice(1, 7)} {...{ saved, onOpen, onToggle }} />
      </section>
      <section className="content-section">
        <Title
          title="Сериалы, которые обсуждают"
          action="Все сериалы"
          onAction={() => onNavigate("series")}
        />
        <Grid items={series.slice(0, 6)} {...{ saved, onOpen, onToggle }} />
      </section>
    </div>
  );
}

function CatalogPage({
  catalog,
  movies,
  series,
  route,
  saved,
  onOpen,
  onToggle,
}) {
  const items =
    route === "movies"
      ? movies
      : route === "series"
        ? series
        : route === "new"
          ? [...catalog]
              .filter((x) => x.year >= 2022)
              .sort((a, b) => b.year - a.year)
          : catalog.filter((x) => saved.includes(x.id));
  const [title, subtitle] = pageInfo[route] || pageInfo.movies;
  return (
    <div className="page catalog-page">
      <div className="catalog-head">
        <p className="eyebrow">КОЛЛЕКЦИЯ VAMS</p>
        <h1>{title}</h1>
        <p>{subtitle}</p>
        <span>
          {items.length}{" "}
          {route === "series"
            ? "сериалов"
            : route === "my-list"
              ? "в коллекции"
              : "фильмов"}
        </span>
      </div>
      {items.length ? (
        <Grid items={items} {...{ saved, onOpen, onToggle }} />
      ) : (
        <Empty
          onGo={() => {
            location.hash = "movies";
          }}
        />
      )}
    </div>
  );
}

function SearchResults({ items, saved, onOpen, onToggle, query }) {
  return (
    <div className="page catalog-page">
      <div className="catalog-head">
        <p className="eyebrow">РЕЗУЛЬТАТЫ ПОИСКА</p>
        <h1>«{query}»</h1>
        <span>Найдено: {items.length}</span>
      </div>
      {items.length ? (
        <Grid items={items} {...{ saved, onOpen, onToggle }} />
      ) : (
        <div className="empty">
          <h2>Ничего не найдено</h2>
          <p>Попробуйте другое название или жанр.</p>
        </div>
      )}
    </div>
  );
}

function Detail({ item, saved, onBack, onToggle }) {
  return (
    <article className="detail">
      <section
        className={`detail__hero ${item.backdrop || item.poster ? "" : "detail__hero--placeholder"}`}
        style={
          item.backdrop || item.poster
            ? { "--detail-bg": `url(${item.backdrop || item.poster})` }
            : undefined
        }
      >
        {!item.backdrop && !item.poster && (
          <div className="detail__media-placeholder">BACKDROP</div>
        )}
        <button className="detail__back" onClick={onBack}>
          <ArrowLeft />
          Назад
        </button>
        <div className="detail__copy">
          <p className="eyebrow">
            {item.type === "series" ? "СЕРИАЛ" : "ФИЛЬМ"} · VAMS FILMS
          </p>
          <h1>{item.title}</h1>
          <h2>{item.original}</h2>
          <div className="detail__meta">
            <b>
              <Star fill="currentColor" /> {item.rating}
            </b>
            <span>
              {item.year}
              {item.endYear ? `–${item.endYear}` : ""}
            </span>
            <span>{item.age}</span>
            <span>{item.duration}</span>
          </div>
          <p className="detail__desc">{item.description}</p>
          <div className="detail__actions">
            <button
              className="button button--light"
              onClick={() =>
                document
                  .querySelector(".player")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <Play fill="currentColor" />
              Смотреть
            </button>
            <button
              className={`button button--glass ${saved ? "is-saved" : ""}`}
              onClick={onToggle}
            >
              {saved ? <Check /> : <Bookmark />}
              {saved ? "В моём списке" : "В мой список"}
            </button>
          </div>
        </div>
      </section>
      <div className="detail__body">
        <section className="player">
          <button aria-label="Воспроизвести">
            <Play fill="currentColor" />
          </button>
          <p>Плеер VAMS</p>
          <span>Место для подключения видеопотока</span>
        </section>
        <aside className="facts">
          <p>
            <span>Жанр</span>
            {item.genres.join(", ")}
          </p>
          <p>
            <span>{item.type === "series" ? "Создатели" : "Режиссёр"}</span>
            {item.director}
          </p>
          <p>
            <span>Название</span>
            {item.original}
          </p>
          <a
            href={`https://www.themoviedb.org/search?query=${encodeURIComponent(item.original)}`}
            target="_blank"
            rel="noreferrer"
          >
            Описание и данные: TMDB ↗
          </a>
        </aside>
      </div>
    </article>
  );
}

function Title({ title, action, onAction }) {
  return (
    <div className="section-title">
      <h2>{title}</h2>
      {action && (
        <button onClick={onAction}>
          {action}
          <ChevronRight />
        </button>
      )}
    </div>
  );
}
function Grid({ items, saved, onOpen, onToggle }) {
  return (
    <div className="catalog-grid">
      {items.map((item, index) => (
        <MovieCard
          key={item.id}
          item={item}
          index={index}
          saved={saved.includes(item.id)}
          onOpen={onOpen}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}
function Empty({ onGo }) {
  return (
    <div className="empty">
      <Bookmark />
      <h2>Здесь пока пусто</h2>
      <p>Добавляйте фильмы и сериалы — они появятся здесь.</p>
      <button className="button button--light" onClick={onGo}>
        Выбрать фильм
      </button>
    </div>
  );
}
export default App;
