import { Bookmark, Check, Play } from "lucide-react";
import "./MovieCard.css";
import "./MovieCardPlaceholder.css";
function MovieCard({ item, saved, onOpen, onToggle, index = 0 }) {
  return (
    <article
      className="movie-card"
      style={{ "--delay": `${Math.min(index, 10) * 55}ms` }}
    >
      <div
        className="movie-card__poster"
        role="button"
        tabIndex="0"
        onClick={() => onOpen(item)}
        onKeyDown={(e) => e.key === "Enter" && onOpen(item)}
        aria-label={`Открыть «${item.title}»`}
      >
        {item.poster ? (
          <img
            src={item.poster}
            alt={`Постер «${item.title}»`}
            loading="lazy"
          />
        ) : (
          <div
            className="movie-card__placeholder"
            aria-label="Место для постера"
          >
            <span>VAMS</span>
            <small>POSTER</small>
          </div>
        )}
        <span className="movie-card__shade" />
        <span className="movie-card__play">
          <Play fill="currentColor" />
        </span>
        {item.rating != null && (
          <span className="movie-card__rating">★ {item.rating}</span>
        )}
        <button
          className={`movie-card__save ${saved ? "is-saved" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggle(item.id);
          }}
          aria-label="Добавить в список"
        >
          {saved ? <Check /> : <Bookmark />}
        </button>
      </div>
      <h3>{item.title}</h3>
      <p>
        {item.year}
        {item.endYear ? `–${item.endYear}` : ""} <span>•</span>{" "}
        {item.genres?.[0] || "фильм"}
      </p>
    </article>
  );
}
export default MovieCard;
