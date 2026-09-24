import SearchBar from "../SearchBar/SearchBar";
import { Bell } from "lucide-react";
import "./Hero.css";
function Hero({ movie }) {
  return (
    <section className="hero" id="top">
      <img
        className="hero__image"
        src={movie.backdrop}
        alt=""
        onError={(event) => {
          event.currentTarget.style.display = "none";
        }}
      />
      <div className="hero__overlay" />
      <div className="hero__topbar">
        <SearchBar />
        <div className="hero__profile">
          <button type="button" className="hero__bell" aria-label="Уведомления">
            <Bell aria-hidden="true" />
          </button>
          <span className="hero__avatar">M</span>
        </div>
      </div>
      <div className="hero__content">
        <p className="hero__eyebrow">
          Б О Л Ь Ш Е , &nbsp; Ч Е М &nbsp; К И Н О
        </p>
        <h1>{movie.title}</h1>
        <p className="hero__meta">
          {movie.year}
          <span>{movie.ageRating}</span>
          <span>{movie.genres}</span>
          <span>{movie.duration}</span>
        </p>
        <p className="hero__description">{movie.description}</p>
        <div className="hero__actions">
          <button className="hero__watch" type="button">
            <span>▶</span> Смотреть
          </button>
          <button className="hero__favorite" type="button">
            <span>＋</span> В избранное
          </button>
        </div>
      </div>
    </section>
  );
}
export default Hero;
