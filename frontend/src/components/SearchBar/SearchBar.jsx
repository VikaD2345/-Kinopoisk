import "./SearchBar.css";
function SearchBar() {
  return (
    <label className="search-bar">
      <span className="search-bar__icon" aria-hidden="true">
        ⌕
      </span>
      <input
        type="search"
        placeholder="Поиск фильмов, сериалов..."
        aria-label="Поиск фильмов и сериалов"
      />
    </label>
  );
}
export default SearchBar;
