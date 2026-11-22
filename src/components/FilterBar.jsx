import { HeartIcon } from "./Icons";

function FilterBar() {
  const categories = ["Hammasi", "Noutbuklar", "Audio", "Aksessuarlar"];

  return (
    <section className="filter-bar" aria-label="Mahsulotlarni saralash">
      <div className="filter-categories">
        {categories.map((category, index) => (
          <button
            key={category}
            type="button"
            className={`filter-tab ${index === 0 ? "active" : ""}`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="filter-controls">
        <button type="button" className="wishlist-toggle">
          <HeartIcon />
          <span>Faqat sevimlilar</span>
        </button>

        <select className="sort-select" defaultValue="default">
          <option value="default">Saralash: Standart</option>
          <option value="price-asc">Narx: Arzondan qimmatga</option>
          <option value="price-desc">Narx: Qimmatdan arzonga</option>
        </select>

        <span className="results-count">6 ta mahsulot</span>
      </div>
    </section>
  );
}

export default FilterBar;
