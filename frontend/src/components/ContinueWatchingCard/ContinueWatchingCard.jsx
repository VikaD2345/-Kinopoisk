import "./ContinueWatchingCard.css";
function ContinueWatchingCard({ title, year, backdrop, onClick }) {
  return (
    <article className="continue-card" onClick={onClick}>
      <button
        type="button"
        className="continue-card__image"
        aria-label={`Продолжить просмотр: ${title}`}
      >
        <img
          src={backdrop}
          alt=""
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
        <span>▶</span>
      </button>
      <p>
        {title} <b>({year})</b>
      </p>
    </article>
  );
}
export default ContinueWatchingCard;
