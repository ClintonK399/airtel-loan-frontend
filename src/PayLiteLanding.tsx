import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

const products = [
  // --- iPhones (Front & Back from PNGimg / CleanPNG) ---
  {
    id: 1,
    brand: "iPhone",
    name: "iPhone 12",
    // Front view – PNGimg transparent
    imageFront: "https://pngimg.com/uploads/iphone_12/iphone_12_PNG29.png",
    // Back view – PNGimg transparent (alternate angle)
    imageBack: "https://pngimg.com/uploads/iphone_12/iphone_12_PNG27.png",
    months: 12,
    downPayment: 35,
    dailyPayment: 0.65,
    days: 360,
    totalPrice: 269,
  },
  {
    id: 2,
    brand: "iPhone",
    name: "iPhone 12 Pro Max",
    // Front view – PNGimg transparent
    imageFront: "https://pngimg.com/uploads/iphone_12_pro_max/iphone_12_pro_max_PNG22.png",
    // Back view – PNGimg transparent
    imageBack: "https://pngimg.com/uploads/iphone_12_pro_max/iphone_12_pro_max_PNG21.png",
    months: 12,
    downPayment: 45,
    dailyPayment: 0.70,
    days: 360,
    totalPrice: 297,
  },
  {
    id: 3,
    brand: "iPhone",
    name: "iPhone 13",
    // Front view – PNGimg transparent
    imageFront: "https://pngimg.com/uploads/iphone_13/iphone_13_PNG29.png",
    // Back view – PNGimg transparent
    imageBack: "https://pngimg.com/uploads/iphone_13/iphone_13_PNG28.png",
    months: 12,
    downPayment: 40,
    dailyPayment: 0.75,
    days: 360,
    totalPrice: 310,
  },
  {
    id: 4,
    brand: "iPhone",
    name: "iPhone 13 Pro Max",
    // Front view – PNGimg transparent
    imageFront: "https://pngimg.com/uploads/iphone_13_pro_max/iphone_13_pro_max_PNG25.png",
    // Back view – PNGimg transparent
    imageBack: "https://pngimg.com/uploads/iphone_13_pro_max/iphone_13_pro_max_PNG24.png",
    months: 12,
    downPayment: 50,
    dailyPayment: 0.80,
    days: 360,
    totalPrice: 338,
  },
  {
    id: 5,
    brand: "iPhone",
    name: "iPhone 14",
    // Front view – PNGimg transparent
    imageFront: "https://pngimg.com/uploads/iphone_14/iphone_14_PNG30.png",
    // Back view – PNGimg transparent
    imageBack: "https://pngimg.com/uploads/iphone_14/iphone_14_PNG29.png",
    months: 12,
    downPayment: 55,
    dailyPayment: 0.95,
    days: 360,
    totalPrice: 397,
  },
  {
    id: 6,
    brand: "iPhone",
    name: "iPhone 14 Pro Max",
    // CleanPNG dual‑view (front + back in one image) – used for both slots
    // so the card still shows a realistic dual‑phone look.
    imageFront: "https://www.cleanpng.com/png-gold-iphone-14-pro-max-dual-view-1qaf3e/download-png.html",
    imageBack: "https://www.cleanpng.com/png-gold-iphone-14-pro-max-dual-view-1qaf3e/download-png.html",
    months: 12,
    downPayment: 55,
    dailyPayment: 0.95,
    days: 360,
    totalPrice: 397,
  },

  // --- Samsung (Front mockups from Mobile FIRST; back images are generic
  //     because free transparent back renders are scarce for these models) ---
  {
    id: 7,
    brand: "Samsung",
    name: "Samsung Galaxy S23 Ultra",
    // Front – Mobile FIRST transparent mockup
    imageFront: "https://www.webmobilefirst.com/en/mockups/samsung-galaxy-s23-ultra-2023/",
    // Back – generic Samsung back (placeholder – replace with an official render)
    imageBack: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=400",
    months: 12,
    downPayment: 45,
    dailyPayment: 0.75,
    days: 360,
    totalPrice: 315,
  },
  {
    id: 8,
    brand: "Samsung",
    name: "Samsung S24 Ultra",
    // Front – Mobile FIRST transparent mockup
    imageFront: "https://www.webmobilefirst.com/en/mockups/samsung-galaxy-s24-ultra-2024/",
    // Back – generic Samsung back (placeholder)
    imageBack: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=400",
    months: 12,
    downPayment: 50,
    dailyPayment: 0.85,
    days: 360,
    totalPrice: 356,
  },
  {
    id: 9,
    brand: "Samsung",
    name: "Samsung S25 Ultra",
    // S25 Ultra not yet widely available as a free transparent PNG –
    // re‑using S24 Ultra front as a stand‑in.
    imageFront: "https://www.webmobilefirst.com/en/mockups/samsung-galaxy-s24-ultra-2024/",
    imageBack: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=400",
    months: 12,
    downPayment: 65,
    dailyPayment: 1.00,
    days: 360,
    totalPrice: 425,
  },

  // --- Tecno (No free transparent front/back renders found – placeholders) ---
  {
    id: 10,
    brand: "Tecno",
    name: "Tecno Spark 40",
    // Front – generic Android front (placeholder)
    imageFront: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=400",
    // Back – generic Android back (placeholder)
    imageBack: "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&q=80&w=400",
    months: 12,
    downPayment: 35,
    dailyPayment: 0.65,
    days: 360,
    totalPrice: 269,
  },
  {
    id: 11,
    brand: "Tecno",
    name: "Tecno Spark 50",
    // Front – generic Android front (placeholder)
    imageFront: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=400",
    // Back – generic Android back (placeholder)
    imageBack: "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&q=80&w=400",
    months: 12,
    downPayment: 45,
    dailyPayment: 0.75,
    days: 360,
    totalPrice: 315,
  },

  // --- Infinix (Front mockup for Hot 70; Hot 60 uses placeholder) ---
  {
    id: 12,
    brand: "Infinix",
    name: "Infinix Hot 60 Pro Plus",
    // Front – generic Android front (placeholder)
    imageFront: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=400",
    // Back – generic Android back (placeholder)
    imageBack: "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&q=80&w=400",
    months: 12,
    downPayment: 45,
    dailyPayment: 0.75,
    days: 360,
    totalPrice: 315,
  },
  {
    id: 13,
    brand: "Infinix",
    name: "Infinix Hot 70 Pro Plus",
    // Front – Mobile FIRST transparent mockup (Hot 70)
    imageFront: "https://www.webmobilefirst.com/en/mockups/infinix-hot-70-2026/",
    // Back – generic Android back (placeholder)
    imageBack: "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&q=80&w=400",
    months: 12,
    downPayment: 55,
    dailyPayment: 0.85,
    days: 360,
    totalPrice: 361,
  },

  // --- Moto (Motorcycle Images – SINGLE IMAGE ONLY, UNALTERED) ---
  {
    id: 14,
    brand: "Moto",
    name: "Boxer 125cc",
    image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=400",
    months: 18,
    downPayment: 60,
    dailyPayment: 1.20,
    days: 540,
    totalPrice: 708,
  },
  {
    id: 15,
    brand: "Moto",
    name: "TVS 125cc",
    image: "https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&q=80&w=400",
    months: 18,
    downPayment: 60,
    dailyPayment: 1.25,
    days: 540,
    totalPrice: 735,
  },
  {
    id: 16,
    brand: "Moto",
    name: "Boxer 150cc",
    image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=400",
    months: 18,
    downPayment: 70,
    dailyPayment: 1.35,
    days: 540,
    totalPrice: 799,
  },
  {
    id: 17,
    brand: "Moto",
    name: "TVS 150cc",
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=400",
    months: 18,
    downPayment: 70,
    dailyPayment: 1.40,
    days: 540,
    totalPrice: 826,
    disclaimer:
      "* Les prix des motos sont estimés. Indiquez l'acompte, le montant quotidien et la durée souhaités et nous mettrons ces offres à jour.",
  },
];

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=400";

const categories = ["Tous", "iPhone", "Samsung", "Tecno", "Infinix", "Moto"];

export default function PayLiteLanding() {
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  const filteredProducts =
    activeCategory === "Tous"
      ? products
      : products.filter((p) => p.brand === activeCategory);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const goToLogin = () => {
    if (selectedProduct) {
      localStorage.setItem("selectedDevice", JSON.stringify(selectedProduct));
    }
    navigate("/login");
  };

  return (
    <div className="paylite-container">
      {/* Header */}
      <header className="pl-header">
        <div className="pl-logo-wrapper">
          <div className="pl-logo-icon">
            <span>P</span>
          </div>
          <span className="pl-logo-text">PayLite</span>
        </div>
        <button onClick={goToLogin} className="pl-btn-outline">
          Commencer
        </button>
      </header>

      <main className="pl-main">
        {/* Hero Section */}
        <div className="pl-hero">
          <div className="pl-badge">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            Petit acompte. Paiements quotidiens faciles.
          </div>
          <h1 className="pl-hero-title">
            Obtenez le téléphone ou la moto que vous voulez, jour après jour.
          </h1>
          <p className="pl-hero-desc">
            Versez un petit acompte aujourd'hui et payez le reste en mensualités
            quotidiennes abordables. Choisissez parmi iPhone, Samsung, Tecno,
            Infinix et motos.
          </p>
          <div className="pl-hero-actions">
            <button
              onClick={() => scrollToSection("offers")}
              className="pl-btn-primary"
            >
              Voir les offres
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="pl-btn-secondary"
            >
              Comment ça marche
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="pl-stats-row">
          <div className="pl-stat-item">
            <div className="pl-stat-value">18+</div>
            <div className="pl-stat-label">
              Appareils et
              <br />
              motos
            </div>
          </div>
          <div className="pl-divider"></div>
          <div className="pl-stat-item">
            <div className="pl-stat-value">35 $</div>
            <div className="pl-stat-label">Acompte dès</div>
          </div>
          <div className="pl-divider"></div>
          <div className="pl-stat-item">
            <div className="pl-stat-value">0,65 $</div>
            <div className="pl-stat-label">Par jour dès</div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="pl-features-grid">
          <div className="pl-feature-card">
            <div className="pl-feature-icon">
              <svg fill="none" stroke="#16a34a" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                <line x1="12" y1="18" x2="12.01" y2="18"></line>
              </svg>
            </div>
            <h4 className="pl-feature-title">Derniers appareils</h4>
            <p className="pl-feature-desc">
              iPhone, Galaxy Ultra, Tecno et Infinix en stock.
            </p>
          </div>
          <div className="pl-feature-card">
            <div className="pl-feature-icon">
              <svg fill="none" stroke="#16a34a" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <h4 className="pl-feature-title">Plans quotidiens</h4>
            <p className="pl-feature-desc">
              Remboursez un peu chaque jour sur 12 à 18 mois.
            </p>
          </div>
          <div className="pl-feature-card">
            <div className="pl-feature-icon">
              <svg fill="none" stroke="#16a34a" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <polyline points="9 12 11 14 15 10"></polyline>
              </svg>
            </div>
            <h4 className="pl-feature-title">Aucuns frais cachés</h4>
            <p className="pl-feature-desc">
              Acompte et montant quotidien clairs dès le départ.
            </p>
          </div>
          <div className="pl-feature-card">
            <div className="pl-feature-icon">
              <svg fill="none" stroke="#16a34a" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                <line x1="2" y1="10" x2="22" y2="10"></line>
              </svg>
            </div>
            <h4 className="pl-feature-title">Propriété totale</h4>
            <p className="pl-feature-desc">
              Terminez votre plan et l'article est 100 % à vous.
            </p>
          </div>
        </div>

        {/* Categories */}
        <div className="pl-categories" id="offers">
          <h2 className="pl-section-subtitle">Choisissez une marque</h2>
          <h3 className="pl-section-title">Parcourez les offres disponibles</h3>
          <div className="pl-dropdown">
            <span>Toutes les offres</span>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
          <div className="pl-tabs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`pl-tab ${activeCategory === cat ? "active" : ""}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product List */}
        <div className="pl-product-list">
          {filteredProducts.map((product) => (
            <div key={product.id} className="pl-product-card">
              <div className="pl-image-container">
                <span className="pl-card-badge">{product.months} mois</span>

                {/* CONDITIONAL RENDER: Dual images for phones, single image for motos */}
                {product.imageFront && product.imageBack ? (
                  <div className="pl-dual-image-wrapper">
                    <img
                      src={product.imageFront}
                      alt={`${product.name} Front`}
                      className="pl-image dual-img"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                      }}
                    />
                    <img
                      src={product.imageBack}
                      alt={`${product.name} Back`}
                      className="pl-image dual-img"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                      }}
                    />
                  </div>
                ) : (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="pl-image"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                    }}
                  />
                )}
              </div>

              <h4 className="pl-product-name">{product.name}</h4>

              <div className="pl-pricing-row">
                <div className="pl-pricing-box pl-box-left">
                  <div className="pl-price-label">Acompte</div>
                  <div className="pl-price-value">{product.downPayment} $</div>
                </div>
                <div className="pl-pricing-box pl-box-right">
                  <div className="pl-price-label">Par jour</div>
                  <div className="pl-price-value">
                    {product.dailyPayment.toFixed(2).replace(".", ",")} $
                  </div>
                </div>
              </div>

              <p className="pl-payment-text">
                Payez <strong>{product.downPayment} $</strong> aujourd'hui, puis{" "}
                <strong>
                  {product.dailyPayment.toFixed(2).replace(".", ",")} $/jour
                </strong>{" "}
                pendant {product.days} jours.
              </p>

              <div className="pl-card-footer">
                <div>
                  <div className="pl-total-label">Prix total à payer</div>
                  <div className="pl-total-value">{product.totalPrice} $*</div>
                </div>
                <button
                  onClick={() => setSelectedProduct(product)}
                  className="pl-btn-demand"
                >
                  Demander
                </button>
              </div>

              {product.disclaimer && (
                <p className="pl-disclaimer-text">{product.disclaimer}</p>
              )}
            </div>
          ))}
        </div>

        {/* 4 Steps Section */}
        <div className="pl-steps-section" id="how-it-works">
          <h2 className="pl-steps-main-title">
            Quatre étapes simples pour en devenir propriétaire
          </h2>
          <div className="pl-steps-list">
            <div className="pl-step-card">
              <div className="pl-step-number">1</div>
              <h3 className="pl-step-title">Choisissez votre article</h3>
              <p className="pl-step-desc">
                Sélectionnez un téléphone ou une moto parmi les offres et
                vérifiez l'acompte et le montant quotidien.
              </p>
            </div>
            <div className="pl-step-card">
              <div className="pl-step-number">2</div>
              <h3 className="pl-step-title">Payez l'acompte</h3>
              <p className="pl-step-desc">
                Versez le petit acompte unique pour réserver votre article et
                démarrer votre plan.
              </p>
            </div>
            <div className="pl-step-card">
              <div className="pl-step-number">3</div>
              <h3 className="pl-step-title">Payez chaque jour</h3>
              <p className="pl-step-desc">
                Remboursez un petit montant fixe chaque jour sur la durée choisie
                de 12 à 18 mois.
              </p>
            </div>
            <div className="pl-step-card">
              <div className="pl-step-number">4</div>
              <h3 className="pl-step-title">Devenez propriétaire</h3>
              <p className="pl-step-desc">
                Une fois votre plan terminé, l'article est 100 % à vous, sans rien
                de plus à payer.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Modal / Bottom Sheet */}
      {selectedProduct && (
        <div className="pl-modal-overlay">
          <div
            className="pl-modal-backdrop"
            onClick={() => setSelectedProduct(null)}
          ></div>

          <div className="pl-modal-content">
            <button
              className="pl-modal-close"
              onClick={() => setSelectedProduct(null)}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="pl-modal-header">
              {/* CONDITIONAL RENDER: Modal images */}
              {selectedProduct.imageFront && selectedProduct.imageBack ? (
                <div className="pl-modal-dual-img">
                  <img
                    src={selectedProduct.imageFront}
                    alt="Front"
                    className="pl-modal-img dual"
                  />
                  <img
                    src={selectedProduct.imageBack}
                    alt="Back"
                    className="pl-modal-img dual"
                  />
                </div>
              ) : (
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="pl-modal-img"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                  }}
                />
              )}

              <div>
                <h3 className="pl-modal-title">{selectedProduct.name}</h3>
                <p className="pl-modal-plan">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Plan de {selectedProduct.months} mois
                </p>
                <p className="pl-modal-total">
                  {selectedProduct.totalPrice} $ au total
                </p>
              </div>
            </div>

            <div className="pl-modal-pricing">
              <div className="pl-pricing-box pl-box-left">
                <div className="pl-price-label">Acompte aujourd'hui</div>
                <div className="pl-price-value">
                  {selectedProduct.downPayment} $
                </div>
              </div>
              <div className="pl-pricing-box pl-box-right">
                <div className="pl-price-label">Paiement quotidien</div>
                <div className="pl-price-value">
                  {selectedProduct.dailyPayment.toFixed(2).replace(".", ",")} $
                </div>
              </div>
            </div>

            <div className="pl-modal-details">
              <div className="pl-detail-row">
                <span>Période de paiement</span>
                <strong>{selectedProduct.days} jours</strong>
              </div>
              <div className="pl-detail-row">
                <span>Total des paiements quotidiens</span>
                <strong>
                  {(
                    selectedProduct.dailyPayment * selectedProduct.days
                  ).toFixed(0)}{" "}
                  $
                </strong>
              </div>
            </div>

            <button onClick={goToLogin} className="pl-btn-continue">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Continuer avec Airtel pour vérifier
            </button>
            <p className="pl-modal-note">
              Vérifiez votre éligibilité - l'inscription est sans engagement.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}