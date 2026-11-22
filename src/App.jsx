import { useState, useMemo, useRef } from 'react'
import './App.css'

const INITIAL_PRODUCTS = [
  {
    id: 1,
    title: 'MacBook Air M2 13"',
    category: 'Noutbuklar',
    categoryLabel: 'NOUTBUKLAR',
    image: '/assets/products/macbook.jpg',
    specs: '8GB RAM • 256GB SSD • Space Gray',
    price: 12400000,
    rating: 4.9,
    stock: 5,
  },
  {
    id: 2,
    title: 'Sony WH-1000XM5',
    category: 'Audio',
    categoryLabel: 'AUDIO',
    image: '/assets/products/sony-headphones.jpg',
    specs: 'Active Noise Cancelling • 30 soat batareya',
    price: 4200000,
    rating: 4.8,
    stock: 8,
  },
  {
    id: 3,
    title: 'Keychron K2 Pro',
    category: 'Aksessuarlar',
    categoryLabel: 'AKSESSUARLAR',
    image: '/assets/products/keychron-keyboard.jpg',
    specs: 'Mexanik klaviatura • Bluetooth / USB-C',
    price: 1350000,
    rating: 4.7,
    stock: 12,
  },
  {
    id: 4,
    title: 'Apple Watch Series 9',
    category: 'Aksessuarlar',
    categoryLabel: 'AKSESSUARLAR',
    image: '/assets/products/apple-watch.jpg',
    specs: '45mm • GPS • Midnight Aluminum',
    price: 5100000,
    rating: 4.9,
    stock: 4,
  },
  {
    id: 5,
    title: 'ASUS Zenbook 14 OLED',
    category: 'Noutbuklar',
    categoryLabel: 'NOUTBUKLAR',
    image: '/assets/products/asus-zenbook.jpg',
    specs: '16GB RAM • 512GB SSD • 2.8K OLED',
    price: 11800000,
    rating: 4.6,
    stock: 0,
  },
  {
    id: 6,
    title: 'Logitech MX Master 3S',
    category: 'Aksessuarlar',
    categoryLabel: 'AKSESSUARLAR',
    image: '/assets/products/logitech-mouse.jpg',
    specs: '8000 DPI • Quiet Clicks • USB-C',
    price: 1210000,
    rating: 4.8,
    stock: 9,
  },
]

const INITIAL_ORDERS = [
  {
    id: '#1024',
    customer: 'Azizbek Karimov',
    status: 'Qabul qilindi',
    summary: 'MacBook Air M2 (1x), Logitech MX Master 3S (1x)',
    delivery: 'Kuryer orqali',
    total: 13610000,
  },
  {
    id: '#1023',
    customer: 'Malika Rustamova',
    status: 'Qabul qilindi',
    summary: 'Sony WH-1000XM5 (1x)',
    delivery: 'Do‘kondan olib ketish',
    total: 4200000,
  },
]

const CATEGORIES = ['Hammasi', 'Noutbuklar', 'Audio', 'Aksessuarlar']

function formatPrice(amount) {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

function App() {
  // Active screen: 'store' | 'cart' | 'login' | 'register'
  const [view, setView] = useState('store')

  // Filter & Search state
  const [selectedCategory, setSelectedCategory] = useState('Hammasi')
  const [searchQuery, setSearchQuery] = useState('')
  const [onlyFavorites, setOnlyFavorites] = useState(false)
  const [sortBy, setSortBy] = useState('default')

  // Wishlist state (initially MacBook Air M2 & Apple Watch Series 9 -> 2 items, matching Figma badge "2")
  const [wishlist, setWishlist] = useState([1, 4])

  // Cart state (initially Sony WH-1000XM5 x1 and Keychron K2 Pro x2 -> 3 items, matching Figma badge "3" and Cart page)
  const [cart, setCart] = useState([
    { productId: 2, quantity: 1 },
    { productId: 3, quantity: 2 },
  ])

  // Promo & checkout state in Cart
  const [promoInput, setPromoInput] = useState('SALE10')
  const [appliedPromo, setAppliedPromo] = useState('SALE10')
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('+998 90 123 45 67')
  const [deliveryMethod, setDeliveryMethod] = useState('courier') // 'courier' | 'pickup'

  // Orders state
  const [orders, setOrders] = useState(INITIAL_ORDERS)
  const ordersSectionRef = useRef(null)

  // Auth & Profile menu state — initialized like Figma 05 — Asosiy sahifa (Profil menyusi)
  const [user, setUser] = useState({
    name: 'Azizbek Karimov',
    shortName: 'Azizbek K.',
    initials: 'AK',
    email: 'azizbek@example.com',
  })
  const [profileMenuOpen, setProfileMenuOpen] = useState(true)

  // Login form state
  const [loginEmail, setLoginEmail] = useState('azizbek@example.com')
  const [loginPassword, setLoginPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  // Register form state
  const [regName, setRegName] = useState('Azizbek Karimov')
  const [regEmail, setRegEmail] = useState('azizbek@example.com')
  const [regPhone, setRegPhone] = useState('+998 90 123 45 67')
  const [regPassword, setRegPassword] = useState('')
  const [regConfirm, setRegConfirm] = useState('')

  // Derived cart items & totals
  const cartItems = useMemo(() => {
    return cart
      .map((entry) => {
        const product = INITIAL_PRODUCTS.find((p) => p.id === entry.productId)
        if (!product) return null
        return {
          ...product,
          quantity: entry.quantity,
          lineTotal: product.price * entry.quantity,
        }
      })
      .filter(Boolean)
  }, [cart])

  const totalCartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  )

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.lineTotal, 0),
    [cartItems]
  )

  const discountAmount = appliedPromo === 'SALE10' ? Math.round(subtotal * 0.1) : 0
  const deliveryCost = cartItems.length > 0 && deliveryMethod === 'courier' ? 30000 : 0
  const grandTotal = Math.max(0, subtotal - discountAmount + deliveryCost)

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    const list = INITIAL_PRODUCTS.filter((product) => {
      if (selectedCategory !== 'Hammasi' && product.category !== selectedCategory) {
        return false
      }
      if (onlyFavorites && !wishlist.includes(product.id)) {
        return false
      }
      if (
        q &&
        !product.title.toLowerCase().includes(q) &&
        !product.specs.toLowerCase().includes(q) &&
        !product.category.toLowerCase().includes(q)
      ) {
        return false
      }
      return true
    })

    if (sortBy === 'price-asc') {
      return [...list].sort((a, b) => a.price - b.price)
    }
    if (sortBy === 'price-desc') {
      return [...list].sort((a, b) => b.price - a.price)
    }
    if (sortBy === 'rating') {
      return [...list].sort((a, b) => b.rating - a.rating)
    }
    return list
  }, [selectedCategory, searchQuery, onlyFavorites, sortBy, wishlist])

  function toggleWishlist(productId) {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    )
  }

  function addToCart(productId) {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === productId)
      if (existing) {
        return prev.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { productId, quantity: 1 }]
    })
  }

  function updateCartQuantity(productId, delta) {
    setCart((prev) =>
      prev
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  function removeFromCart(productId) {
    setCart((prev) => prev.filter((item) => item.productId !== productId))
  }

  function handleApplyPromo(e) {
    e.preventDefault()
    const code = promoInput.trim().toUpperCase()
    if (code === 'SALE10') {
      setAppliedPromo('SALE10')
    } else {
      setAppliedPromo('')
    }
  }

  function handlePlaceOrder() {
    if (cartItems.length === 0) return
    const nextNum = 1023 + orders.length
    const nameToUse = customerName.trim() || (user ? user.name : 'Azizbek Karimov')
    const summaryStr = cartItems.map((i) => `${i.title} (${i.quantity}x)`).join(', ')
    const newOrder = {
      id: `#${nextNum}`,
      customer: nameToUse,
      status: 'Qabul qilindi',
      summary: summaryStr,
      delivery: deliveryMethod === 'courier' ? 'Kuryer orqali' : 'Do‘kondan olib ketish',
      total: grandTotal,
    }
    setOrders((prev) => [newOrder, ...prev])
    setCart([])
    setView('store')
  }

  function makeUserObject(fullName, email) {
    const cleanName = fullName.trim() || 'Azizbek Karimov'
    const parts = cleanName.split(/\s+/)
    const initials =
      parts.length >= 2
        ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
        : cleanName.slice(0, 2).toUpperCase()
    const shortName =
      parts.length >= 2 ? `${parts[0]} ${parts[1][0]}.` : cleanName
    return {
      name: cleanName,
      shortName,
      initials,
      email: email.trim() || 'azizbek@example.com',
    }
  }

  function handleLoginSubmit(e) {
    e.preventDefault()
    setUser(makeUserObject('Azizbek Karimov', loginEmail))
    setProfileMenuOpen(true)
    setView('store')
  }

  function handleRegisterSubmit(e) {
    e.preventDefault()
    setUser(makeUserObject(regName, regEmail))
    setProfileMenuOpen(true)
    setView('store')
  }

  function handleLogout() {
    setProfileMenuOpen(false)
    setView('login')
  }

  return (
    <div className="tb-app">
      {/* Header */}
      <header className="tb-header" data-node-id="8:339">
        <div className="tb-header-inner">
          <button
            type="button"
            className="tb-brand"
            onClick={() => {
              setView('store')
            }}
          >
            <div className="tb-brand-logo">TB</div>
            <div className="tb-brand-text">
              <span className="tb-brand-title">TexnoBozor</span>
              <span className="tb-brand-subtitle">Zamonaviy texnika do‘koni</span>
            </div>
          </button>

          <div className={`tb-search ${searchQuery.trim() ? 'is-active' : ''}`}>
            <div className="tb-search-left">
              <img
                src="/assets/a56da.svg"
                alt=""
                width="16"
                height="16"
                className="tb-search-icon"
              />
              <input
                type="text"
                className="tb-search-input"
                placeholder="Mahsulot nomi bo‘yicha qidirish..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  if (view !== 'store') setView('store')
                }}
              />
            </div>
            {searchQuery && (
              <button
                type="button"
                className="tb-search-clear"
                onClick={() => setSearchQuery('')}
                aria-label="Qidiruvni tozalash"
              >
                <img src="/assets/6a7a6.svg" alt="" width="12" height="12" />
              </button>
            )}
          </div>

          <div className="tb-header-actions">
            <button
              type="button"
              className={`tb-pill tb-pill-outline ${onlyFavorites && view === 'store' ? 'is-active' : ''}`}
              onClick={() => {
                setView('store')
                setOnlyFavorites((prev) => !prev)
              }}
            >
              <img
                src="/assets/59498.svg"
                alt=""
                width="16"
                height="16"
                className="tb-pill-icon"
              />
              <span>Sevimlilar</span>
              <span className="tb-badge-light">{wishlist.length}</span>
            </button>

            <button
              type="button"
              className="tb-pill tb-pill-dark"
              onClick={() => {
                setView('cart')
                setProfileMenuOpen(false)
              }}
            >
              <img
                src="/assets/a5e9e.svg"
                alt=""
                width="16"
                height="16"
                className="tb-pill-icon"
              />
              <span>Savat</span>
              <span className="tb-badge-dark">{totalCartCount}</span>
            </button>

            <div className="tb-header-divider" />

            <button
              type="button"
              className={`tb-pill tb-pill-outline ${view === 'login' ? 'is-active' : ''}`}
              onClick={() => {
                setView('login')
                setProfileMenuOpen(false)
              }}
            >
              <img
                src="/assets/e3dd5.svg"
                alt=""
                width="16"
                height="16"
                className="tb-pill-icon"
              />
              <span>Kirish</span>
            </button>

            <button
              type="button"
              className="tb-pill tb-pill-brand"
              onClick={() => {
                setView('register')
                setProfileMenuOpen(false)
              }}
            >
              <span>Ro‘yxatdan o‘tish</span>
            </button>

            {user && (
              <div className="tb-profile-wrap">
                <button
                  type="button"
                  className="tb-profile-trigger"
                  onClick={() => setProfileMenuOpen((prev) => !prev)}
                >
                  <span className="tb-profile-avatar-sm">{user.initials}</span>
                  <span className="tb-profile-name-sm">{user.shortName}</span>
                  <img
                    src="/assets/09f06.svg"
                    alt=""
                    width="15"
                    height="15"
                    className={`tb-profile-chevron ${profileMenuOpen ? '' : 'is-closed'}`}
                  />
                </button>

                {profileMenuOpen && (
                  <div className="tb-profile-dropdown" data-node-id="8:374">
                    <div className="tb-profile-head">
                      <div className="tb-profile-avatar-lg">{user.initials}</div>
                      <div className="tb-profile-user">
                        <span className="tb-profile-user-name">{user.name}</span>
                        <span className="tb-profile-user-email">{user.email}</span>
                      </div>
                    </div>
                    <div className="tb-dropdown-divider" />
                    <div className="tb-dropdown-list">
                      <button
                        type="button"
                        className="tb-dropdown-item is-muted"
                        onClick={() => {
                          setProfileMenuOpen(false)
                          setView('store')
                        }}
                      >
                        <span className="tb-dropdown-item-left">
                          <img src="/assets/34c60.svg" alt="" width="16" height="16" />
                          <span>Profilim</span>
                        </span>
                      </button>
                      <button
                        type="button"
                        className="tb-dropdown-item"
                        onClick={() => {
                          setProfileMenuOpen(false)
                          setView('store')
                          setTimeout(() => {
                            ordersSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
                          }, 50)
                        }}
                      >
                        <span className="tb-dropdown-item-left">
                          <img src="/assets/6b251.svg" alt="" width="16" height="16" />
                          <span>Buyurtmalarim</span>
                        </span>
                        <span className="tb-dropdown-count">{orders.length}</span>
                      </button>
                      <button
                        type="button"
                        className="tb-dropdown-item"
                        onClick={() => {
                          setProfileMenuOpen(false)
                          setView('store')
                          setOnlyFavorites(true)
                        }}
                      >
                        <span className="tb-dropdown-item-left">
                          <img src="/assets/107fd.svg" alt="" width="16" height="16" />
                          <span>Sevimlilarim</span>
                        </span>
                        <span className="tb-dropdown-count">{wishlist.length}</span>
                      </button>
                    </div>
                    <div className="tb-dropdown-divider" />
                    <div className="tb-dropdown-logout-wrap">
                      <button
                        type="button"
                        className="tb-dropdown-logout"
                        onClick={handleLogout}
                      >
                        <img src="/assets/03825.svg" alt="" width="16" height="16" />
                        <span>Chiqish</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 05 / 01 / 06 / 07 — Store Main View */}
      {view === 'store' && (
        <main className="tb-main" data-node-id="8:413">
          {/* FilterBar */}
          <section className="tb-filterbar" data-node-id="5:44">
            <div className="tb-categories">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={`tb-category-tab ${selectedCategory === category ? 'is-active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="tb-controls">
              {searchQuery.trim() !== '' && (
                <div className="tb-search-chip" data-node-id="9:876">
                  <span>{`Qidiruv: "${searchQuery.trim()}"`}</span>
                  <button
                    type="button"
                    className="tb-search-chip-clear"
                    onClick={() => setSearchQuery('')}
                    aria-label="Qidiruvni tozalash"
                  >
                    <img src="/assets/6a7a6.svg" alt="" width="12" height="12" />
                  </button>
                </div>
              )}

              <button
                type="button"
                className={`tb-wishlist-toggle ${onlyFavorites ? 'is-active' : ''}`}
                onClick={() => setOnlyFavorites((prev) => !prev)}
              >
                <img
                  src={onlyFavorites ? '/assets/7a2ac.svg' : '/assets/107fd.svg'}
                  alt=""
                  width="16"
                  height="16"
                />
                <span>Faqat sevimlilar</span>
              </button>

              <div className="tb-sort-wrap">
                <select
                  className="tb-sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  aria-label="Saralash"
                >
                  <option value="default">Saralash: Standart</option>
                  <option value="price-asc">Narx: Arzondan qimmatga</option>
                  <option value="price-desc">Narx: Qimmatdan arzonga</option>
                  <option value="rating">Reyting bo‘yicha</option>
                </select>
                <img
                  src="/assets/d88a3.svg"
                  alt=""
                  width="14"
                  height="14"
                  className="tb-sort-chevron"
                />
              </div>

              <span className="tb-product-count">{filteredProducts.length} ta mahsulot</span>
            </div>
          </section>

          {/* Product Grid or EmptyState */}
          {filteredProducts.length > 0 ? (
            <section className="tb-product-grid" data-node-id="7:331">
              {filteredProducts.map((product) => {
                const isLiked = wishlist.includes(product.id)
                const inStock = product.stock > 0
                return (
                  <article key={product.id} className="tb-product-card" data-node-id="2:100">
                    <div className={`tb-product-visual ${inStock ? '' : 'is-out'}`}>
                      <img
                        src={product.image}
                        alt={product.title}
                        className="tb-product-img"
                      />
                      <span className={`tb-stock-badge ${inStock ? 'in-stock' : 'out-stock'}`}>
                        {inStock ? `Omborda: ${product.stock} ta` : 'Tugagan'}
                      </span>
                      <button
                        type="button"
                        className={`tb-wishlist-btn ${isLiked ? 'is-liked' : ''}`}
                        onClick={() => toggleWishlist(product.id)}
                        aria-label="Sevimlilarga qo‘shish"
                      >
                        <img
                          src={isLiked ? '/assets/7a2ac.svg' : '/assets/b51d3.svg'}
                          alt=""
                          width="16"
                          height="16"
                        />
                      </button>
                    </div>

                    <div className="tb-product-body">
                      <div className="tb-product-meta">
                        <span className="tb-product-category">{product.categoryLabel}</span>
                        <span className="tb-product-rating">
                          <img src="/assets/8f28a.svg" alt="" width="13" height="13" />
                          <span>{product.rating}</span>
                        </span>
                      </div>
                      <h3 className="tb-product-title">{product.title}</h3>
                      <p className="tb-product-specs">{product.specs}</p>
                      <div className="tb-product-divider" />
                      <div className="tb-product-footer">
                        <span className="tb-product-price">{formatPrice(product.price)} so&apos;m</span>
                        <button
                          type="button"
                          className="tb-add-btn"
                          disabled={!inStock}
                          onClick={() => addToCart(product.id)}
                        >
                          {inStock && (
                            <img src="/assets/a5e9e.svg" alt="" width="16" height="16" />
                          )}
                          <span>{inStock ? 'Savatga' : 'Mavjud emas'}</span>
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </section>
          ) : (
            <section className="tb-empty-state" data-node-id="9:603">
              <div className="tb-empty-icon-wrap">
                <img src="/assets/80bdd.svg" alt="" width="26" height="26" />
              </div>
              <h3 className="tb-empty-title">Mahsulot topilmadi</h3>
              <p className="tb-empty-desc">
                “{searchQuery.trim() || selectedCategory}” so‘rovi bo‘yicha mos mahsulot topilmadi.
                Boshqa so‘z bilan urinib ko‘ring.
              </p>
              <button
                type="button"
                className="tb-empty-reset"
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('Hammasi')
                  setOnlyFavorites(false)
                }}
              >
                Qidiruvni tozalash
              </button>
            </section>
          )}

          {/* OrdersSection */}
          <section className="tb-orders-section" ref={ordersSectionRef} data-node-id="5:349">
            <div className="tb-orders-head">
              <h2 className="tb-orders-title">So‘nggi buyurtmalar</h2>
              <p className="tb-orders-subtitle">Tasdiqlangan buyurtmalar ro‘yxati</p>
            </div>
            <div className="tb-orders-grid">
              {orders.map((order) => (
                <div key={order.id} className="tb-order-card" data-node-id="2:146">
                  <div className="tb-order-top">
                    <span className="tb-order-id">
                      {order.id} — {order.customer}
                    </span>
                    <span className="tb-order-status">{order.status}</span>
                  </div>
                  <p className="tb-order-summary">{order.summary}</p>
                  <div className="tb-order-divider" />
                  <div className="tb-order-bottom">
                    <span className="tb-order-delivery">{order.delivery}</span>
                    <span className="tb-order-total">{formatPrice(order.total)} so&apos;m</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      )}

      {/* 02 — Savat (Cart) */}
      {view === 'cart' && (
        <main className="tb-cart-page" data-node-id="7:334">
          <div className="tb-cart-top">
            <div className="tb-cart-top-left">
              <span className="tb-section-badge">Savat</span>
              <h1 className="tb-cart-heading">Savatingiz</h1>
              <p className="tb-cart-subheading">
                {totalCartCount} ta mahsulot tanlangan — buyurtmani rasmiylashtiring
              </p>
            </div>
            <button type="button" className="tb-back-btn" onClick={() => setView('store')}>
              <span>←</span>
              <span>Do‘konga qaytish</span>
            </button>
          </div>

          <div className="tb-cart-grid">
            <section className="tb-cart-items-card">
              <div className="tb-cart-items-head">
                <div className="tb-cart-items-title">
                  <span>🛒</span>
                  <span>Tanlangan mahsulotlar ({totalCartCount})</span>
                </div>
                {cartItems.length > 0 && (
                  <button
                    type="button"
                    className="tb-cart-clear-btn"
                    onClick={() => setCart([])}
                  >
                    Savatni tozalash
                  </button>
                )}
              </div>

              <div className="tb-dropdown-divider" />

              {cartItems.length > 0 ? (
                <div className="tb-cart-item-list">
                  {cartItems.map((item) => (
                    <div key={item.id} className="tb-cart-page-item">
                      <div className="tb-cart-item-visual">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="tb-cart-item-img"
                        />
                      </div>
                      <div className="tb-cart-item-info">
                        <span className="tb-cart-item-cat">{item.categoryLabel}</span>
                        <span className="tb-cart-item-name">{item.title}</span>
                        <span className="tb-cart-item-specs">{item.specs}</span>
                        <span className="tb-cart-item-unit">
                          1 dona narxi: {formatPrice(item.price)} so&apos;m
                        </span>
                      </div>
                      <div className="tb-cart-item-actions">
                        <div className="tb-qty-stepper">
                          <button
                            type="button"
                            className="tb-qty-btn"
                            onClick={() => updateCartQuantity(item.id, -1)}
                          >
                            −
                          </button>
                          <span className="tb-qty-val">{item.quantity}</span>
                          <button
                            type="button"
                            className="tb-qty-btn"
                            onClick={() => updateCartQuantity(item.id, 1)}
                          >
                            +
                          </button>
                        </div>
                        <span className="tb-cart-item-total">
                          {formatPrice(item.lineTotal)} so&apos;m
                        </span>
                        <button
                          type="button"
                          className="tb-trash-btn"
                          onClick={() => removeFromCart(item.id)}
                          aria-label="O‘chirish"
                        >
                          <img src="/assets/c3342.svg" alt="" width="16" height="16" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="tb-empty-desc" style={{ alignSelf: 'center', padding: '32px 0' }}>
                  Savatingiz hozircha bo‘sh. Do‘kondan mahsulot qo‘shing.
                </p>
              )}
            </section>

            <aside className="tb-cart-summary-card">
              <h2 className="tb-summary-title">Buyurtmani rasmiylashtirish</h2>
              <div className="tb-dropdown-divider" />

              <form className="tb-promo-box" onSubmit={handleApplyPromo}>
                <div className="tb-promo-row">
                  <input
                    type="text"
                    className="tb-input"
                    placeholder="Promo kod (masalan: SALE10)"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                  />
                  <button type="submit" className="tb-promo-btn">
                    Qo‘llash
                  </button>
                </div>
                {appliedPromo === 'SALE10' && (
                  <span className="tb-promo-msg">SALE10 qo‘llandi — 10% chegirma</span>
                )}
              </form>

              <div className="tb-dropdown-divider" />

              <div className="tb-order-form-group">
                <span className="tb-order-form-label">Buyurtma ma’lumotlari</span>
                <input
                  type="text"
                  className="tb-input"
                  placeholder="Ismingiz"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
                <input
                  type="text"
                  className="tb-input"
                  placeholder="+998 90 123 45 67"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
                <div className="tb-delivery-options">
                  <button
                    type="button"
                    className={`tb-delivery-option ${deliveryMethod === 'courier' ? 'is-selected' : ''}`}
                    onClick={() => setDeliveryMethod('courier')}
                  >
                    <span className="tb-delivery-name">Kuryer orqali</span>
                    <span className="tb-delivery-price">30 000 so&apos;m</span>
                  </button>
                  <button
                    type="button"
                    className={`tb-delivery-option ${deliveryMethod === 'pickup' ? 'is-selected' : ''}`}
                    onClick={() => setDeliveryMethod('pickup')}
                  >
                    <span className="tb-delivery-name">Olib ketish</span>
                    <span className="tb-delivery-price">Bepul</span>
                  </button>
                </div>
              </div>

              <div className="tb-dropdown-divider" />

              <div className="tb-summary-totals">
                <div className="tb-summary-row">
                  <span>Mahsulotlar</span>
                  <span>{formatPrice(subtotal)} so&apos;m</span>
                </div>
                {discountAmount > 0 && (
                  <div className="tb-summary-row is-discount">
                    <span>Chegirma (10%)</span>
                    <span>− {formatPrice(discountAmount)} so&apos;m</span>
                  </div>
                )}
                <div className="tb-summary-row">
                  <span>Yetkazib berish</span>
                  <span>
                    {deliveryCost > 0 ? `${formatPrice(deliveryCost)} so'm` : 'Bepul'}
                  </span>
                </div>
                <div className="tb-summary-grand">
                  <span>Jami summa</span>
                  <span>{formatPrice(grandTotal)} so&apos;m</span>
                </div>
              </div>

              <button
                type="button"
                className="tb-checkout-btn"
                disabled={cartItems.length === 0}
                onClick={handlePlaceOrder}
              >
                Buyurtma berish
              </button>
            </aside>
          </div>
        </main>
      )}

      {/* 03 — Kirish (Login) */}
      {view === 'login' && (
        <main className="tb-auth-stage" data-node-id="6:265">
          <div className="tb-auth-card is-login">
            <div className="tb-auth-top">
              <span className="tb-section-badge">Kirish</span>
              <button type="button" className="tb-back-btn" onClick={() => setView('store')}>
                <span>←</span>
                <span>Do‘konga qaytish</span>
              </button>
            </div>

            <div className="tb-auth-head">
              <h1 className="tb-auth-title">Hisobga kirish</h1>
              <p className="tb-auth-subtitle">
                Buyurtmalar tarixi va savatingizni ko‘rish uchun hisobingizga kiring.
              </p>
            </div>

            <form className="tb-auth-form" onSubmit={handleLoginSubmit}>
              <div className="tb-field">
                <label className="tb-field-label">Elektron pochta</label>
                <input
                  type="email"
                  className="tb-field-input"
                  placeholder="azizbek@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>

              <div className="tb-field">
                <label className="tb-field-label">Parol</label>
                <input
                  type="password"
                  className="tb-field-input"
                  placeholder="Parolingizni kiriting"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>

              <label className="tb-remember-row">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Meni eslab qol</span>
              </label>

              <button type="submit" className="tb-auth-submit is-dark">
                Kirish
              </button>
            </form>

            <div className="tb-auth-footer">
              <span>Hali hisobingiz yo‘qmi?</span>
              <button
                type="button"
                className="tb-auth-link"
                onClick={() => setView('register')}
              >
                Ro‘yxatdan o‘tish
              </button>
            </div>
          </div>
        </main>
      )}

      {/* 04 — Ro‘yxatdan o‘tish (Register) */}
      {view === 'register' && (
        <main className="tb-auth-stage" data-node-id="6:333">
          <div className="tb-auth-card is-register">
            <div className="tb-auth-top">
              <span className="tb-section-badge">Ro‘yxatdan o‘tish</span>
              <button type="button" className="tb-back-btn" onClick={() => setView('store')}>
                <span>←</span>
                <span>Do‘konga qaytish</span>
              </button>
            </div>

            <div className="tb-auth-head">
              <h1 className="tb-auth-title">Yangi hisob yaratish</h1>
              <p className="tb-auth-subtitle">
                Tezkor buyurtma berish va sevimlilarni saqlash uchun ro‘yxatdan o‘ting.
              </p>
            </div>

            <form className="tb-auth-form" onSubmit={handleRegisterSubmit}>
              <div className="tb-field">
                <label className="tb-field-label">To‘liq ism</label>
                <input
                  type="text"
                  className="tb-field-input"
                  placeholder="Azizbek Karimov"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  required
                />
              </div>

              <div className="tb-form-row-2">
                <div className="tb-field">
                  <label className="tb-field-label">Elektron pochta</label>
                  <input
                    type="email"
                    className="tb-field-input"
                    placeholder="azizbek@example.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="tb-field">
                  <label className="tb-field-label">Telefon raqam</label>
                  <input
                    type="tel"
                    className="tb-field-input"
                    placeholder="+998 90 123 45 67"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="tb-form-row-2">
                <div className="tb-field">
                  <label className="tb-field-label">Parol</label>
                  <input
                    type="password"
                    className="tb-field-input"
                    placeholder="Kamida 6 ta belgi"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="tb-field">
                  <label className="tb-field-label">Parolni tasdiqlang</label>
                  <input
                    type="password"
                    className="tb-field-input"
                    placeholder="Parolni qayta kiriting"
                    value={regConfirm}
                    onChange={(e) => setRegConfirm(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="tb-auth-submit is-brand">
                Ro‘yxatdan o‘tish
              </button>
            </form>

            <div className="tb-auth-footer">
              <span>Allaqachon hisobingiz bormi?</span>
              <button
                type="button"
                className="tb-auth-link"
                onClick={() => setView('login')}
              >
                Kirish
              </button>
            </div>
          </div>
        </main>
      )}
    </div>
  )
}

export default App
