import { CartIcon, HeartIcon, SearchIcon, UserIcon } from "./Icons";

function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <div className="brand">
          <div className="brand-mark">TB</div>
          <div>
            <p className="brand-title">TexnoBozor</p>
            <p className="brand-subtitle">Zamonaviy texnika do‘koni</p>
          </div>
        </div>

        <div className="header-search">
          <span className="header-search-icon">
            <SearchIcon />
          </span>
          <input
            type="text"
            className="header-search-input"
            placeholder="Mahsulot nomi bo‘yicha qidirish..."
          />
        </div>

        <div className="header-actions">
          <button type="button" className="header-pill">
            <HeartIcon filled />
            <span>Sevimlilar</span>
            <span className="pill-count">2</span>
          </button>

          <button type="button" className="header-pill header-pill--dark">
            <CartIcon />
            <span>Savat</span>
            <span className="pill-count">3</span>
          </button>

          <div className="header-divider" aria-hidden="true" />

          <button type="button" className="header-pill">
            <UserIcon />
            <span>Kirish</span>
          </button>

          <button type="button" className="header-pill header-pill--brand">
            <span>Ro‘yxatdan o‘tish</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
