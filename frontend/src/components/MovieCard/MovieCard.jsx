import "./MovieCard.css";
function MovieCard({ id, title, year, poster, rating, onClick }) {
  return (
    <article className="movie-card" onClick={onClick} data-movie-id={id}>
      <button
        type="button"
        className="movie-card__poster"
        aria-label={`Открыть фильм «${title}»`}
      >
        <img
          src={poster}
          alt={`Постер «${title}»`}
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
        {rating && <span className="movie-card__rating">★ {rating}</span>}
      </button>
      <h3>{title}</h3>
      <p>{year}</p>
    </article>
  );
}
export default MovieCard;
