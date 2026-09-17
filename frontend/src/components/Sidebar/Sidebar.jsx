import "./Sidebar.css";
import { Bookmark, Circle, Clapperboard, House, Tags, Tv } from "lucide-react";

const primaryLinks = [
  { icon: House, label: "Главная" },
  { icon: Clapperboard, label: "Фильмы" },
  { icon: Tv, label: "Сериалы" },
];

const secondaryLinks = [
  { icon: Circle, label: "Новинки" },
  { icon: Bookmark, label: "Мой список" },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <a className="sidebar__logo" href="#top">
        VAMS films
      </a>
      <nav className="sidebar__nav" aria-label="Основная навигация">
        {primaryLinks.map(({ icon: Icon, label }, index) => (
          <a
            className={`sidebar__link ${index === 0 ? "sidebar__link--active" : ""}`}
            href={index === 0 ? "#top" : "#trending"}
            key={label}
          >
            <Icon aria-hidden="true" />
            {label}
          </a>
        ))}
      </nav>
      <nav
        className="sidebar__nav sidebar__nav--secondary"
        aria-label="Библиотека"
      >
        {secondaryLinks.map(({ icon: Icon, label }) => (
          <a className="sidebar__link" href="#trending" key={label}>
            <Icon aria-hidden="true" />
            {label}
          </a>
        ))}
      </nav>
      <p className="sidebar__caption">
        <Tags aria-hidden="true" />
        ЖАНРЫ
      </p>
    </aside>
  );
}
export default Sidebar;
